import { BaseSDK, generateId, globalInstances, LISTENER_CMDS } from "../core";
import { EVENT_TYPES } from "../core/constants";
import { CreateProxy } from "../core/proxy";

import { Page } from "./page";

import { AppContext } from "../types/internal";
import { rolesObject, RunEnvelope, RunStatus, RunWatchError } from "../types/external";

import { DecisionTable } from "./decisiontable";
import { Dataform, CustomComponentDataform } from "../dataform";
import { Board, CustomComponentBoard } from "../board";
import { Process, CustomComponentProcess } from "../process";
import { Agent } from "./agent";

// A read the host never answers fails instead of hanging (an older host ignores these commands).
const READ_TIMEOUT_MS = 30_000;
// An Interactive run may take up to 30 s on the service; the rest covers the host round trip.
const RUN_TIMEOUT_MS = 45_000;
const WATCH_ACK_TIMEOUT_MS = 60_000;
// The host stops observing 600 s after the watch starts, after one last read; this covers a host that
// stops answering.
const WATCH_DEADLINE_MS = 690_000;

function sdkError(errorCode: string, error: string): RunWatchError {
	return { isError: true, error, errorCode };
}

// The app's own callback runs inside the message listener every SDK call shares; its error must not escape there.
function notify<T>(callback: ((value: T) => void) | undefined, value: T) {
	try {
		callback?.(value);
	} catch (error) {
		console.error(error);
	}
}

const NOT_SENT = sdkError("FUNCTION_REQUEST_NOT_SENT", "The request could not be sent to the host.");

const TERMINAL_STATUSES: RunStatus[] = ["Success", "Failed", "TimedOut"];

export class Application extends BaseSDK {
	page: Page;
	// variable: AppVariable;
	_id: string;
	// Event target for run completion events; registered only while a watch is active.
	private activeWatches = 0;

	constructor(props: AppContext, isCustomComponent: boolean = false) {
		super();
		this._id = props.appId;
		this.page = new Page(props);
		// /* Note: Synchronous variable read/write is not supported for custom components
		//  * as it is not possible to use Atomics.wait in the main thread and iframe thread
		//  */
		// !isCustomComponent && (this.variable = new AppVariable());
	}
	getVariable(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_APP_VARIABLE, {
			key
		});
	}

	setVariable(key: string | object, value?: any) {
		return this._postMessageAsync(LISTENER_CMDS.SET_APP_VARIABLE, {
			key,
			value
		});
	}

	openPage(pageId: string, pageParams?: object) {
		return this._postMessageAsync(LISTENER_CMDS.OPEN_PAGE, {
			pageId,
			pageParams
		});
	}

	/**
	 * Run a published Custom Function by name.
	 *
	 * An Interactive function resolves with its terminal envelope. A Background
	 * function resolves as soon as it is queued, with `Status: "Queued"` and a
	 * `RunId`; use {@link getFunctionRun} or {@link onFunctionRunComplete} for its result.
	 *
	 * A refused run rejects with the platform's SDK error shape: the message
	 * text is in `error` and the code (`KISSFLOW_ERROR_…`) in `errorCode`.
	 * A host that does not answer within 45 s rejects with
	 * `FUNCTION_RUN_OUTCOME_UNKNOWN`: the run may still have started, so tell
	 * the user instead of starting another.
	 *
	 * Custom Functions are application-scoped: this is reachable from page,
	 * component and flow event scripts that run inside an application, where
	 * `kf.app` exists. There is no `kf.app` outside one.
	 *
	 * @example
	 * const run = await kf.app.runFunction("review_expense_claim", { claimId });
	 */
	runFunction(name: string, parameters?: Record<string, unknown>): Promise<RunEnvelope> {
		return this._postMessageBounded(
			LISTENER_CMDS.CUSTOM_FUNCTION_RUN,
			{ name, parameters: parameters ?? {} },
			{
				timeoutMs: RUN_TIMEOUT_MS,
				timeoutError: sdkError(
					"FUNCTION_RUN_OUTCOME_UNKNOWN",
					"The host did not answer the run; it may still have started."
				),
				sendError: sdkError("FUNCTION_RUN_NOT_SENT", "The run request could not be sent to the host.")
			}
		).promise as Promise<RunEnvelope>;
	}

	/**
	 * Fetch a run's current state, including its `Result` once it has one.
	 *
	 * @example
	 * const run = await kf.app.getFunctionRun(runId);
	 * if (run.Status === "Success") use(run.Result);
	 */
	getFunctionRun(runId: string): Promise<RunEnvelope> {
		return this._postMessageBounded(
			LISTENER_CMDS.CUSTOM_FUNCTION_GET_RUN,
			{ runId },
			{
				timeoutMs: READ_TIMEOUT_MS,
				timeoutError: sdkError("FUNCTION_HOST_TIMEOUT", "The host did not answer the run request."),
				sendError: NOT_SENT
			}
		).promise as Promise<RunEnvelope>;
	}

	/**
	 * Be told when a Background run reaches a terminal state.
	 *
	 * Fires `callBack` once with the run's envelope. "Complete" means the run
	 * stopped, not that it worked: it fires on `Failed` and `TimedOut` just as
	 * it does on `Success`, so read `Status` before trusting `Result`. If the
	 * host cannot watch the run at all, `onError` is called instead of
	 * `callBack` ever firing: an older host (`FUNCTION_HOST_UNSUPPORTED`), a
	 * refusal, or the watch limit (`FUNCTION_OBSERVATION_STOPPED`, after about
	 * ten minutes; the run may still finish, so read it later with
	 * {@link getFunctionRun}). At most one of the two is called, at most once.
	 *
	 * Returns a function that unsubscribes. The callback lives only as long as
	 * the script that registered it: form events end their script after 60 s
	 * and a page event ends the previous one when it fires again, while a
	 * Background run may take up to 600 s. Prefer polling {@link getFunctionRun} from a
	 * script that outlives the run, or re-attach after the script restarts.
	 *
	 * @example
	 * const stop = kf.app.onFunctionRunComplete(run.RunId, (done) => show(done), (err) => warn(err));
	 * // later, e.g. on unmount — the host stops watching the run too
	 * stop();
	 */
	onFunctionRunComplete(
		runId: string,
		callBack: (run: RunEnvelope) => void,
		onError?: (error: RunWatchError) => void
	): () => void {
		const watchId = generateId("functionwatch");
		const eventName = `${EVENT_TYPES.CUSTOM_FUNCTION_RUN_COMPLETE}:${watchId}`;
		let settled = false;
		let deadline: ReturnType<typeof setTimeout> | null = null;
		let registration: { promise: Promise<any>; cancel: () => void } | null = null;

		const end = () => {
			settled = true;
			if (deadline) clearTimeout(deadline);
			registration?.cancel();
			this._removeEventListener(eventName);
			this.activeWatches -= 1;
			if (this.activeWatches === 0) Reflect.deleteProperty(globalInstances, this._id);
		};
		// Best effort: the host may already be gone, and local cleanup must not depend on it.
		const tellHostToStop = () => {
			try {
				this._postMessage(LISTENER_CMDS.CUSTOM_FUNCTION_STOP_WATCH, { id: this._id, runId, watchId, eventName });
			} catch {
				// Nothing left to release on this side.
			}
		};
		const fail = (error: RunWatchError) => {
			if (settled) return;
			end();
			tellHostToStop();
			notify(onError, error);
		};
		const listener = (params: RunEnvelope | RunWatchError) => {
			if (settled) return;
			if ((params as RunWatchError)?.isError) {
				end();
				notify(onError, params as RunWatchError);
				return;
			}
			const run = params as RunEnvelope;
			if (run?.RunId !== runId || TERMINAL_STATUSES.indexOf(run?.Status) === -1) {
				fail(sdkError("FUNCTION_WATCH_INVALID_EVENT", "The host reported something other than a finished run."));
				return;
			}
			end();
			notify(callBack, run);
		};

		this.activeWatches += 1;
		globalInstances[this._id] = this;
		this._addEventListener(eventName, listener);
		registration = this._postMessageBounded(
			LISTENER_CMDS.CUSTOM_FUNCTION_ON_RUN_COMPLETE,
			{ id: this._id, runId, watchId, eventName },
			{
				timeoutMs: WATCH_ACK_TIMEOUT_MS,
				timeoutError: sdkError("FUNCTION_HOST_UNSUPPORTED", "The host did not start watching the run."),
				sendError: NOT_SENT
			}
		);
		registration.promise.then(
			(acknowledged) => {
				if (settled) return;
				// The host replies { Watching: true }, which reaches here unwrapped as `true`.
				if (acknowledged !== true) {
					fail(sdkError("FUNCTION_HOST_UNSUPPORTED", "The host did not start watching the run."));
					return;
				}
				deadline = setTimeout(
					() => fail(sdkError("FUNCTION_OBSERVATION_STOPPED", "Stopped checking the run; read it again later.")),
					WATCH_DEADLINE_MS
				);
			},
			(error: RunWatchError) => fail(error)
		);

		return () => {
			if (settled) return;
			end();
			tellHostToStop();
		};
	}

	getDecisionTable(flowId: string): DecisionTable {
		return new DecisionTable(flowId);
	}

	/**
	 * Get a published Custom Agent of this app by its id. The handle sends no request until you call one
	 * of its methods; see {@link Agent}.
	 *
	 * @example
	 * const agent = kf.app.getAgent("AgXXXXXXXXXX");
	 * const { ExecutionId } = await agent.execute({ inputData: { request: "Two desks" } });
	 */
	getAgent(agentId: string): Agent {
		return new Agent(agentId);
	}

	getDataform(flowId: string): Dataform {
		return new Dataform(flowId);
	}

	getBoard(flowId: string): Board {
		return new Board(flowId);
	}

	getProcess(flowId: string): Process {
		return new Process(flowId);
	}

	/**
	 * List the app's roles and which of them the current user is a member of.
	 *
	 * Only available in a Development account - use this to build a role
	 * picker UI inside the component, then pass the chosen role to
	 * {@link switchRole}.
	 *
	 * @returns A promise that resolves with `{ roles, currentRoles }` - the
	 * full list of app roles and the subset the current user belongs to.
	 *
	 * @example
	 * const { roles, currentRoles } = await kf.app.getRoles();
	 */
	getRoles(): Promise<{ roles: rolesObject[]; currentRoles: rolesObject[] }> {
		return this._postMessageAsync(LISTENER_CMDS.GET_ROLES, {}) as Promise<{
			roles: rolesObject[];
			currentRoles: rolesObject[];
		}>;
	}

	/**
	 * Switch the current user's active role in a Development account.
	 *
	 * This performs a real role change - it removes the user from their
	 * current role(s) and adds them to the target role. The platform's app
	 * shell (top nav, other widgets) picks up the new role on its own; no
	 * page reload happens. Only available in a Development account.
	 *
	 * @param args - Either `roleId` or `roleName` identifying the target role
	 * (use the values returned by {@link getRoles}).
	 * @returns A promise that resolves with the switched-to role.
	 *
	 * @example
	 * const { roles } = await kf.app.getRoles();
	 * await kf.app.switchRole({ roleId: roles[1]._id });
	 */
	switchRole(args: { roleId?: string; roleName?: string }) {
		return this._postMessageAsync(LISTENER_CMDS.SWITCH_ROLE, {
			roleId: args.roleId,
			roleName: args.roleName
		}) as Promise<rolesObject>;
	}
}

/**
 * Application with custom-component-only capabilities.
 *
 * Used by the custom-component SDK (`kf.app`). Its flow accessors return the
 * `CustomComponent*` variants, which expose `initForm` — a method that the
 * Low/No-code (Run Script) SDKs deliberately do not have.
 */
export class CustomComponentApplication extends Application {
	getDataform(flowId: string): CustomComponentDataform {
		return new CustomComponentDataform(flowId);
	}

	getBoard(flowId: string): CustomComponentBoard {
		return new CustomComponentBoard(flowId);
	}

	getProcess(flowId: string): CustomComponentProcess {
		return new CustomComponentProcess(flowId);
	}
}


class AppVariable extends BaseSDK {
	constructor() {
		super()
		return new CreateProxy(this)
	}

	get(key, path) {
		let args = {
			key,
			path: path
		}
		return this._postMessageSync(LISTENER_CMDS.GET_APP_VARIABLE, args);
	}

	set(key, value, path) {
		let args = {
			key,
			value,
			path
		}
		return this._postMessageSync(LISTENER_CMDS.SET_APP_VARIABLE, args);
	}
}

export * from "./component";
export { Agent };
export { Page };
export * from "./popup";
