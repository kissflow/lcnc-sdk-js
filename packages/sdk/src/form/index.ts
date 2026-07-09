import { BaseSDK, LISTENER_CMDS } from "../core";

export class Form extends BaseSDK {
    // The Zustand form store's lookup key — internal only, used to route the
    // store-bound commands below. Never expose this as `instanceId`: that
    // name is reserved for the real record id (see below).
    private storeId: string;
    private flowId: string;
    type: string;
    // The real record id and (process-only) activity instance id — what a
    // caller means by "instanceId" for REST-style calls like getFieldOptions
    // or parseAttachment, which have nothing to do with the form store.
    instanceId: string;
    activityInstanceId?: string;
    constructor(
        storeId: string,
        flowId: string,
        instanceId: string,
        activityInstanceId?: string
    ) {
        super();
        this.type = "Form";
        this.storeId = storeId;
        this.flowId = flowId;
        this.instanceId = instanceId;
        this.activityInstanceId = activityInstanceId;
    }
    toJSON() {
        return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
            storeId: this.storeId,
            instanceId: this.instanceId
        });
    }
    getField(fieldId: string) {
        return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            fieldId
        });
    }
    updateField(args: object) {
        return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            data: args
        });
    }
    getValidationErrors() {
        return this._postMessageAsync(
            LISTENER_CMDS.GET_FORM_VALIDATION_ERRORS,
            {
                storeId: this.storeId,
                instanceId: this.instanceId
            }
        );
    }
    getFormConfiguration() {
        return this._postMessageAsync(LISTENER_CMDS.GET_FORM_CONFIGURATION, {
            storeId: this.storeId,
            instanceId: this.instanceId
        });
    }
    getFieldState() {
        return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD_STATE, {
            storeId: this.storeId,
            instanceId: this.instanceId
        });
    }
    getTable(tableId: string) {
        return new Table(
            this.storeId,
            this.flowId,
            this.instanceId,
            tableId,
            this.activityInstanceId
        );
    }
}

class Table extends BaseSDK {
    private storeId: string;
    private flowId: string;
    private instanceId: string;
    private tableId: string;
    private activityInstanceId?: string;

    constructor(
        storeId: string,
        flowId: string,
        instanceId: string,
        tableId: string,
        activityInstanceId?: string
    ) {
        super();
        this.tableId = tableId;
        this.storeId = storeId;
        this.flowId = flowId;
        this.instanceId = instanceId;
        this.activityInstanceId = activityInstanceId;
    }

    // list of obj of rows
    toJSON() {
        return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId
        });
    }

    getSelectedRows() {
        return this._postMessageAsync(LISTENER_CMDS.GET_SELECTED_TABLE_ROWS, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId
        });
    }

    getRows(): TableForm[] {
        // list of TableForm class
        return this._postMessageAsync(
            LISTENER_CMDS.GET_TABLE_ROWS,
            {
                storeId: this.storeId,
                instanceId: this.instanceId,
                tableId: this.tableId
            },
            true, // has callBack
            (data) => {
                return data.map(
                    (row: { id: string }) =>
                        new TableForm(
                            this.storeId,
                            this.flowId,
                            this.instanceId,
                            this.tableId,
                            row.id,
                            this.activityInstanceId
                        )
                );
            }
        );
    }

    getRow(rowId: string) {
        return new TableForm(
            this.storeId,
            this.flowId,
            this.instanceId,
            this.tableId,
            rowId,
            this.activityInstanceId
        );
    }

    addRow(rowObject: object) {
        return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROW, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId,
            rowObject
        });
    }

    addRows(rows: object[]) {
        return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROWS, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId,
            rows
        });
    }

    deleteRow(rowId: string) {
        return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId,
            rows: [rowId]
        });
    }

    deleteRows(rows: string[]) {
        return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId,
            rows
        });
    }
}

export class TableForm extends BaseSDK {
    private storeId: string;
    private flowId: string;
    private instanceId: string;
    private tableId: string;
    private rowId: string;
    private activityInstanceId?: string;
    type: string;

    constructor(
        storeId: string,
        flowId: string,
        instanceId: string,
        tableId: string,
        rowId: string,
        activityInstanceId?: string
    ) {
        super();
        this.storeId = storeId;
        this.flowId = flowId;
        this.instanceId = instanceId;
        this.type = "TabelForm";
        this.tableId = tableId;
        this.rowId = rowId;
        this.activityInstanceId = activityInstanceId;
    }

    getParent() {
        return new Form(
            this.storeId,
            this.flowId,
            this.instanceId,
            this.activityInstanceId
        );
    }

    toJSON() {
        return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId,
            rowId: this.rowId
        });
    }

    getField(fieldId: string) {
        return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId,
            rowId: this.rowId,
            fieldId
        });
    }

    updateField(args: object) {
        return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
            storeId: this.storeId,
            instanceId: this.instanceId,
            tableId: this.tableId,
            rowId: this.rowId,
            data: args
        });
    }
}
