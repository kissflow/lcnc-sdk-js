import { BaseSDK } from "./base.js";
import { LISTENER_CMDS } from "./constants.js";
export class Form extends BaseSDK {
    getField(fieldId) {
        return this._postMessageUtil(LISTENER_CMDS.GET_FORM_FIELD, {
            fieldId
        });
    }
    updateField(args = {}) {
        return this._postMessageUtil(LISTENER_CMDS.UPDATE_FORM, {
            data: args
        });
    }
    getTable(tableId) {
        return new Table(tableId);
    }
}
class Table extends BaseSDK {
    constructor(tableId) {
        super({});
        this.tableId = tableId;
    }
    getField(rowIndex, fieldId) {
        return this._postMessageUtil(LISTENER_CMDS.GET_FORM_TABLE_FIELD, {
            tableId: this.tableId,
            rowIndex,
            fieldId
        });
    }
    updateField(rowIndex, fieldId, fieldValue) {
        return this._postMessageUtil(LISTENER_CMDS.UPDATE_FORM_TABLE, {
            data: {
                tableId: this.tableId,
                rowIndex,
                fieldId,
                fieldValue
            }
        });
    }
}
