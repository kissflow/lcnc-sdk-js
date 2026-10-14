import { BaseSDK, EVENT_TYPES, LISTENER_CMDS, generateId, globalInstances } from "../core";

import {
	AgentContract,
	AgentError,
	AgentExecuteOptions,
	AgentExecution,
	AgentExecutionAccepted
} from "../types/external";

// A read that the host never answers fails instead of hanging (an older host ignores these commands).
const READ_TIMEOUT_MS = 75_000;
// Long enough for a slow acceptance; after it the run may or may not have started.
const EXECUTE_TIMEOUT_MS = 60_000;
const WATCH_ACK_TIMEOUT_MS = 60_000;
// The host stops observing 330 s after registration, after one last read of up to 60 s; this covers a host that
// stops answering.
const WATCH_DEADLINE_MS = 420_000;

const TERMINAL_STATUSES = ["Completed", "Failed"];

function sdkError(errorCode: string, error: string): AgentError {
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

const NOT_SENT = sdkError("AGENT_REQUEST_NOT_SENT", "The request could not be sent to the host.");

/**
 * A published Custom Agent of the current app.
 *
 * Get one with `kf.app.getAgent(agentId)`. Calls run as the signed-in user, against the Agent's
 * published (Live) definition.
 */
export class Agent extends BaseSDK {
	private agentId: string;
	// Event target for completion events; registered only while a watch is active.
	private _id: string;
	private activeWatches = 0;

	constructor(agentId: string) {
		super();
		this.agentId = agentId;
		this._id = generateId("customagent");
	}

	/**
	 * Read the Agent's published contract: its inputs, outputs and readiness.
	 *
	 * @example
	 * const { Definition } = await kf.app.getAgent("AgXXXXXXXXXX").getContract();
	 */
	getContract(): Promise<AgentContract> {
		return this._postMessageBounded(
			LISTENER_CMDS.CUSTOM_AGENT_GET_CONTRACT,
			{ agentId: this.agentId },
			{
				timeoutMs: READ_TIMEOUT_MS,
				timeoutError: sdkError("AGENT_HOST_TIMEOUT", "The host did not answer the Agent contract request."),
				sendError: NOT_SENT
			}
		).promise;
	}

	/**
	 * Start a run. Resolves once the run is accepted (`ExecutionId`, `Status`), not when it finishes;
	 * use {@link onExecutionComplete} or {@link getExecution} for the result.
	 *
	 * Never retried: if the call fails with `AGENT_EXECUTE_OUTCOME_UNKNOWN`, a run may still have
	 * started. `AGENT_EXECUTE_NOT_SENT` means it was not sent (for example, the user is offline).
	 *
	 * @example
	 * const { ExecutionId } = await agent.execute({ inputData: { request: "Two desks", amount: 54000 } });
	 */
	execute(options: AgentExecuteOptions): Promise<AgentExecutionAccepted> {
		return this._postMessageBounded(
			LISTENER_CMDS.CUSTOM_AGENT_EXECUTE,
			{ agentId: this.agentId, inputData: options?.inputData ?? {} },
			{
				timeoutMs: EXECUTE_TIMEOUT_MS,
				timeoutError: sdkError(
					"AGENT_EXECUTE_OUTCOME_UNKNOWN",
					"The host did not confirm the run; it may still have started."
				),
				// Posting failed (for example, inputData that cannot be cloned): nothing reached the host.
				sendError: sdkError("AGENT_EXECUTE_NOT_SENT", "The run request could not be sent to the host.")
			}
		).promise;
	}

	/**
	 * Read a run's current state, with its `Output` once `Completed` or its `Error` once `Failed`.
	 * Callers who are not the App's authors can read only their own runs.
	 */
	getExecution(executionId: string): Promise<AgentExecution> {
		return this._postMessageBounded(
			LISTENER_CMDS.CUSTOM_AGENT_GET_EXECUTION,
			{ agentId: this.agentId, executionId },
			{
				timeoutMs: READ_TIMEOUT_MS,
				timeoutError: sdkError("AGENT_HOST_TIMEOUT", "The host did not answer the Agent execution request."),
				sendError: NOT_SENT
			}
		).promise;
	}

	/**
	 * Be told once when a run finishes. `onComplete` gets the run on `Completed` or `Failed` (read
	 * `Status`: a failed run is a result, not an error). `onWatchError` gets what stopped the
	 * observation instead: an unsupported host, an access or network failure, or the observation limit
	 * (`AGENT_OBSERVATION_STOPPED`, after about six minutes; the run may still finish, so read it later
	 * with {@link getExecution}). At most one of the two is called, at most once.
	 *
	 * Returns a function that stops observing. It never cancels the run.
	 *
	 * @example
	 * const stop = agent.onExecutionComplete(ExecutionId, (run) => show(run), (err) => warn(err));
	 * // later, e.g. on unmount
	 * stop();
	 */
	onExecutionComplete(
		executionId: string,
		onComplete: (execution: AgentExecution) => void,
		onWatchError?: (error: AgentError) => void
	): () => void {
		const watchId = generateId("agentwatch");
		const eventName = `${EVENT_TYPES.CUSTOM_AGENT_EXECUTION_COMPLETE}:${watchId}`;
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
				this._postMessage(LISTENER_CMDS.CUSTOM_AGENT_STOP_WATCH, { id: this._id, watchId, eventName });
			} catch {
				// Nothing left to release on this side.
			}
		};
		const fail = (error: AgentError) => {
			if (settled) return;
			end();
			tellHostToStop();
			notify(onWatchError, error);
		};
		const listener = (params: AgentExecution | AgentError) => {
			if (settled) return;
			if ((params as AgentError)?.isError) {
				end();
				notify(onWatchError, params as AgentError);
				return;
			}
			const execution = params as AgentExecution;
			if (execution?.ExecutionId !== executionId || TERMINAL_STATUSES.indexOf(execution?.Status) === -1) {
				fail(sdkError("AGENT_WATCH_INVALID_EVENT", "The host reported something other than a finished run."));
				return;
			}
			end();
			notify(onComplete, execution);
		};

		this.activeWatches += 1;
		globalInstances[this._id] = this;
		this._addEventListener(eventName, listener);
		registration = this._postMessageBounded(
			LISTENER_CMDS.CUSTOM_AGENT_WATCH_EXECUTION,
			{ id: this._id, agentId: this.agentId, executionId, watchId, eventName },
			{
				timeoutMs: WATCH_ACK_TIMEOUT_MS,
				timeoutError: sdkError("AGENT_HOST_UNSUPPORTED", "The host did not start observing the Agent run."),
				sendError: NOT_SENT
			}
		);
		registration.promise.then(
			(acknowledged) => {
				if (settled) return;
				// The host replies { Watching: true }, which reaches here unwrapped as `true`.
				if (acknowledged !== true) {
					fail(sdkError("AGENT_HOST_UNSUPPORTED", "The host did not start observing the Agent run."));
					return;
				}
				deadline = setTimeout(
					() => fail(sdkError("AGENT_OBSERVATION_STOPPED", "Stopped checking the Agent run; read it again later.")),
					WATCH_DEADLINE_MS
				);
			},
			(error: AgentError) => fail(error)
		);

		return () => {
			if (settled) return;
			end();
			tellHostToStop();
		};
	}
}
