import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Form extends BaseSDK {
	getField(fieldId: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
			fieldId
		});
	}
	updateField(args: object) {
		return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
			data: args
		});
	}
	addTableRow(tableId: string, rowObject: object) {
		return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROW, {
			tableId,
			rowObject
		});
	}
}
