import { BaseSDK, LISTENER_CMDS } from "../core";

export class Board extends BaseSDK {
	private _id: string;

	constructor(flowId: string) {
		super();
		this._id = flowId;
	}

	importCSV(defaultValues: object) {
		return this._postMessageAsync(LISTENER_CMDS.BOARD_IMPORT_CSV, {
			flowId: this._id,
			defaultValues
		});
	}

	openForm(itemId: string) {
		if(!itemId) {
			return Promise.reject({
				message: "itemId is required"
			});
		}
		return this._postMessageAsync(LISTENER_CMDS.BOARD_OPEN_FORM, {
			flowId: this._id,
			itemId
		});
	}
}
