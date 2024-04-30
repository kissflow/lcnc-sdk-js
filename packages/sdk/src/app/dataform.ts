import { BaseSDK, LISTENER_CMDS } from "../core";

export class Dataform extends BaseSDK {
	private _id: string;

	constructor(flowId: string) {
		super();
		this._id = flowId;
	}

	importCSV(defaultValues?: object) {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_IMPORT_CSV, {
			flowId: this._id,
			defaultValues
		});
	}
}
