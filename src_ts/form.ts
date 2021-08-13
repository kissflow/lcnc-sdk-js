import { BaseSDK } from "./base.js";
import { LISTENER_CMDS } from "./constants.js";

export class Form extends BaseSDK {
	// tableId: string;
	getField(fieldId: string) {
		return this._postMessageUtil(LISTENER_CMDS.GETFORMFIELD, {
			fieldId
		});
	}
	updateField(args = {}) {
		return this._postMessageUtil(LISTENER_CMDS.UPDATEFORM, {
			data: args
		});
	}
	getTable(tableId: string) {
		return new Table(tableId);
	}
}

class Table extends BaseSDK {
	tableId: string;
	constructor(tableId: string) {
		super({});
		this.tableId = tableId;
	}
	getField(rowIndex: number, fieldId: string) {
		return this._postMessageUtil(LISTENER_CMDS.GETFORMTABLEFIELD, {
			tableId: this.tableId,
			rowIndex,
			fieldId
		});
	}
	updateField(
		rowIndex: number,
		fieldId: string,
		fieldValue: string
	) {
		return this._postMessageUtil(LISTENER_CMDS.UPDATEFORMTABLE, {
			data: {
				tableId: this.tableId,
				rowIndex,
				fieldId,
				fieldValue
			}
		});
	}
}
