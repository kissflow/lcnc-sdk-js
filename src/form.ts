import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Form extends BaseSDK {
	getField(fieldId: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
			fieldId
		});
	}
	updateField(args = {}) {
		return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
			data: args
		});
	}
}

// interface TABLE_DATA {
// 	tableId: string;
// 	minRow: number | null;
// 	maxRow: number | null;
// 	columns: string[];
// }
// class Table extends BaseSDK {
// 	tableId: string;
// 	rowLimits: {
// 		max: number;
// 		min: number;
// 	};
// 	columns: string[];
// 	constructor(tableData: TABLE_DATA) {
// 		super({});
// 		this.tableId = tableData.tableId;
// 		this.rowLimits = {
// 			max: tableData?.maxRow ?? 99,
// 			min: tableData?.minRow ?? 0
// 		};
// 		this.columns = tableData.columns;
// 	}
// 	getField(rowIndex: number, fieldId: string) {
// 		return this._postMessageAsync(LISTENER_CMDS.GET_FORM_TABLE_FIELD, {
// 			tableId: this.tableId,
// 			rowIndex,
// 			fieldId
// 		});
// 	}
// 	updateField(rowIndex: number, fieldId: string, fieldValue: string) {
// 		return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM_TABLE, {
// 			data: {
// 				tableId: this.tableId,
// 				rowIndex,
// 				fieldId,
// 				fieldValue
// 			}
// 		});
// 	}
// }
