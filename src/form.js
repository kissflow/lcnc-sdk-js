import { BaseSDK } from "./base.js";
import { LISTENER_CMDS } from "./constants.js";
export class Form extends BaseSDK {
    // tableId: string;
    getField(fieldId) {
        return this._postMessageUtil(LISTENER_CMDS.GETFORMFIELD, {
            fieldId
        });
    }
    updateField(args = {}) {
        return this._postMessageUtil(LISTENER_CMDS.UPDATEFORM, {
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
        return this._postMessageUtil(LISTENER_CMDS.GETFORMTABLEFIELD, {
            tableId: this.tableId,
            rowIndex,
            fieldId
        });
    }
    updateField(rowIndex, fieldId, fieldValue) {
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
