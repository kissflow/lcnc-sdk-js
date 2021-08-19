import { BaseSDK } from "./base.js";
import { LISTENER_CMDS } from "./constants.js";
export class Form extends BaseSDK {
    getField(fieldId) {
        return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
            fieldId
        });
    }
    updateField(args = {}) {
        return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
            data: args
        });
    }
    getTable(tableId) {
        return this._postMessageAsync(LISTENER_CMDS.GET_TABLE_DETAILS, { tableId: tableId }, true, // has callBack
        (data) => {
            return new Table(data.resp); // callBack function
        });
    }
}
class Table extends BaseSDK {
    constructor(tableData) {
        var _a, _b;
        super({});
        this.tableId = tableData.tableId;
        this.rowLimits = {
            max: (_a = tableData === null || tableData === void 0 ? void 0 : tableData.maxRow) !== null && _a !== void 0 ? _a : 99,
            min: (_b = tableData === null || tableData === void 0 ? void 0 : tableData.minRow) !== null && _b !== void 0 ? _b : 0
        };
        this.columns = tableData.columns;
    }
    getField(rowIndex, fieldId) {
        return this._postMessageAsync(LISTENER_CMDS.GET_FORM_TABLE_FIELD, {
            tableId: this.tableId,
            rowIndex,
            fieldId
        });
    }
    updateField(rowIndex, fieldId, fieldValue) {
        return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM_TABLE, {
            data: {
                tableId: this.tableId,
                rowIndex,
                fieldId,
                fieldValue
            }
        });
    }
}
