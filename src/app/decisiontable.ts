import { BaseSDK, LISTENER_CMDS } from "../core";

export class DecisionTable extends BaseSDK {
	private flowId: string;

	constructor(flowId: string) {
		super();
		this.flowId = flowId;
	}

	evaluate(payload?: object) {
		return this._postMessageAsync(LISTENER_CMDS.DECISION_TABLE_EXECUTE, {
			flowId: this.flowId,
			payload
		});
	}
}
