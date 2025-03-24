import { BaseSDK, LISTENER_CMDS } from "../core";
import { BoardItem } from "../types/external";

export class Board extends BaseSDK {
	private _id: string;

	constructor(flowId: string) {
		super();
		this._id = flowId;
	}

	importCSV(defaultValues?: object) {
		return this._postMessageAsync(LISTENER_CMDS.BOARD_IMPORT_CSV, {
			flowId: this._id,
			defaultValues
		});
	}

	openForm(item: BoardItem) {		
		if (!item._id) {
			return Promise.reject({
				message: "Instance Id (_id) is required"
			});
		}
		return this._postMessageAsync(LISTENER_CMDS.BOARD_OPEN_FORM, {
			flowId: this._id,
			itemId: item._id,
			viewId: item._view_id
		});
	}
}
