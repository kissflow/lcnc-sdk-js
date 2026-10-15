import { BaseSDK, globalInstances, LISTENER_CMDS } from "../core";
import { EVENT_TYPES } from "../core/constants";
import { CreateProxy } from "../core/proxy";

import { Page } from "./page";

import { AppContext } from "../types/internal";
import { rolesObject, RunEnvelope, RunWatchError } from "../types/external";

import { DecisionTable } from "./decisiontable";
import { Dataform } from "../dataform";
import { Board } from "../board";
import { Process } from "../process";

export class Application extends BaseSDK {
	page: Page;
	// variable: AppVariable;
	_id: string;

	constructor(props: AppContext, isCustomComponent: boolean = false) {
		super();
		this._id = props.appId;
		globalInstances[this._id] = this;
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
	 *
	 * Custom Functions are application-scoped: this is reachable from page,
	 * component and flow event scripts that run inside an application, where
	 * `kf.app` exists. There is no `kf.app` outside one.
	 *
	 * @example
	 * const run = await kf.app.runFunction("review_expense_claim", { claimId });
	 */
	runFunction(name: string, parameters?: Record<string, unknown>): Promise<RunEnvelope> {
		return this._postMessageAsync(LISTENER_CMDS.CUSTOM_FUNCTION_RUN, {
			name,
			parameters: parameters ?? {}
		}) as Promise<RunEnvelope>;
	}

	/**
	 * Fetch a run's current state, including its `Result` once it has one.
	 *
	 * @example
	 * const run = await kf.app.getFunctionRun(runId);
	 * if (run.Status === "Success") use(run.Result);
	 */
	getFunctionRun(runId: string): Promise<RunEnvelope> {
		return this._postMessageAsync(LISTENER_CMDS.CUSTOM_FUNCTION_GET_RUN, {
			runId
		}) as Promise<RunEnvelope>;
	}

	/**
	 * Be told when a Background run reaches a terminal state.
	 *
	 * Fires `callBack` once with the run's envelope. "Complete" means the run
	 * stopped, not that it worked: it fires on `Failed` and `TimedOut` just as
	 * it does on `Success`, so read `Status` before trusting `Result`. If the
	 * host cannot watch the run at all, `onError` is called instead of
	 * `callBack` ever firing.
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
		const eventName = `${EVENT_TYPES.CUSTOM_FUNCTION_RUN_COMPLETE}:${runId}`;
		const listener = (params: RunEnvelope | RunWatchError) => {
			if (params && (params as { isError?: boolean }).isError) {
				onError?.(params as RunWatchError);
				return;
			}
			callBack(params as RunEnvelope);
		};
		this._postMessage(
			LISTENER_CMDS.CUSTOM_FUNCTION_ON_RUN_COMPLETE,
			{
				id: this._id,
				runId,
				eventName,
				eventConfig: {
					once: true
				}
			},
			listener
		);
		return () => {
			this._removeEventListener(eventName, listener);
			this._postMessage(LISTENER_CMDS.CUSTOM_FUNCTION_STOP_WATCH, { id: this._id, runId, eventName });
		};
	}

	getDecisionTable(flowId: string): DecisionTable {
		return new DecisionTable(flowId);
	}

	getDataform(flowId: string): Dataform {
		return new Dataform(flowId);
	}

	getBoard(flowId: string) {
		return new Board(flowId);
	}

	getProcess(flowId: string) {
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
export { Page };
export * from "./popup";
