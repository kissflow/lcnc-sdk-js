import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Form extends BaseSDK {
	instanceId: string;
	constructor(instanceId: string) {
		super({});
		this.instanceId = instanceId;
	}
	getField(fieldId: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
			instanceId: this.instanceId,
			fieldId
		});
	}
	updateField(args: object) {
		return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
			data: args
		});
	}
	getTable(tableId: string) {
		return this._postMessageAsync(
			LISTENER_CMDS.GET_TABLE,
			{ tableId: tableId },
			true, // has callBack
			(data) => {
				return new Table(this.instanceId, tableId); // callBack function
			}
		);
	}
}

class Table extends BaseSDK {
	tableId: string;
	instanceId: string;
	constructor(instanceId: string,tableId: string) {
		// debugger;
		super({});
		this.tableId = tableId;
		this.instanceId = instanceId
	}

	getRows() {
		return this._postMessageAsync(LISTENER_CMDS.GET_TABLE_ROWS, {
			tableId: this.tableId
		});
	}

	getRow(rowIndex: number) {
		return this._postMessageAsync(LISTENER_CMDS.GET_TABLE_ROW, {
			tableId: this.tableId,
			rowIndex
		});
	}
	
	// array of obj
	addRow( rowObject: object) {
		debugger;
		return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROW, {
			tableId: this.tableId,
			rowObject
		});
	}

	deleteRow( rowIndex: number) {
		return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
			tableId: this.tableId,
			rowIndex
		});
	}
}

export class TableForm extends BaseSDK {
	instanceId: string;
	tableId: string;
	table: Table;
	parent: Form;

	constructor(instanceId: string, tableId: string) {
		super({});
		debugger;
		this.tableId = tableId;
		this.instanceId = instanceId;
		this.parent = new Form(instanceId);
		this.table = new Table(instanceId, tableId);
	}
	
	getField(fieldId: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
			instanceId: this.instanceId,
			tableId: this.tableId,
			fieldId
		});
	}

	updateField(args: object) {
		return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
			instanceId: this.instanceId,
			tableId: this.tableId,
			data: args
		});
	}
}

