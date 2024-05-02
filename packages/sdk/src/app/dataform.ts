import { BaseSDK, LISTENER_CMDS } from "../core";

interface DataformItem{
	_id: string;
}
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

	openForm(item: DataformItem) {
		if (!item._id) {
			return Promise.reject({
				message: "Instance Id (_id) is required"
			});
		}
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_OPEN_FORM, {
			flowId: this._id,
			itemId: item._id
		});
	}
}
