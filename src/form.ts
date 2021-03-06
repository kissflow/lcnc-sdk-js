import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Form extends BaseSDK {
	private instanceId: string;
	constructor(instanceId: string) {
		super({});
		this.instanceId = instanceId;
	}
	toJSON() {
		return this._postMessageAsync(
			LISTENER_CMDS.TO_JSON,
			{ 
				instanceId: this.instanceId
			},
		);
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
		return new Table(this.instanceId, tableId);
	}
}

class Table extends BaseSDK {
	private tableId: string;
	private instanceId: string;

	constructor(instanceId: string,tableId: string) {
		super({});
		this.tableId = tableId;
		this.instanceId = instanceId
	}

	// list of obj of rows
	toJSON() {
		return this._postMessageAsync(
			LISTENER_CMDS.TO_JSON,
			{ 
				tableId: this.tableId
			},
		);
	}

	getRows():TableForm[] {
		// list of TableForm class
		return this._postMessageAsync(
			LISTENER_CMDS.GET_TABLE_ROWS,
			{ tableId: this.tableId },
			true, // has callBack
			(data) => {
				console.log(data);
				return data.map((row) => new TableForm(this.instanceId, this.tableId, row.id))
			}
		);
	}

	getRow(rowId: string) {
		return new TableForm(this.instanceId, this.tableId, rowId);
	}
	
	addRow(rowObject: object) {
		return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROW, {
			tableId: this.tableId,
			rowObject
		});
	}

	deleteRow(rowId: string) {
		return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
			tableId: this.tableId,
			rowId
		});
	}
}

export class TableForm extends BaseSDK {
	private instanceId: string;
	private tableId: string;
	private rowId: string;

	constructor(instanceId: string, tableId: string, rowId: string) {
		super({});
		this.instanceId = instanceId;
		this.tableId = tableId;
		this.rowId = rowId;
	}

	getParent() {
		return new Form(this.instanceId);
	}

	toJSON() {
		return this._postMessageAsync(
			LISTENER_CMDS.TO_JSON,
			{ 
				tableId: this.tableId,
				rowId: this.rowId
			},
		);

	}
	
	getField(fieldId: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
			instanceId: this.instanceId,
			tableId: this.tableId,
			rowId: this.rowId,
			fieldId
		});
	}

	updateField(args: object) {
		return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
			instanceId: this.instanceId,
			tableId: this.tableId,
			rowId: this.rowId,
			data: args
		});
	}
}

