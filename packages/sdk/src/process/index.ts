import { BaseSDK, LISTENER_CMDS } from "../core";
import { Form } from "../form";
import {
    ProcessItem,
    ProcessMyItemsOptions,
    ProcessMyTasksOptions,
    ProcessParticipatedOptions,
    ProcessAdminOptions,
    ProcessQueryResponse,
    ProcessCreateItemOptions,
    ProcessUpdateItemOptions,
    ProcessDeleteItemOptions,
    ProcessFieldOptions
} from "../types/external";
import { requireFieldAsync, requireFieldsAsync } from "../utils/validation";

export class Process extends BaseSDK {
    private _id: string;

    constructor(flowId: string) {
        super();
        this._id = flowId;
    }

    /**
     * Get my items from this process (items I initiated)
     * @param options - Query options (status, searchValue, pageNumber, pageSize, filters, sortBy)
     * @returns Promise containing items and total count
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * // Get draft items
     * const { items } = await process.getMyItems({ status: "draft" });
     * // Get in-progress items
     * const { items } = await process.getMyItems({ status: "inprogress" });
     */
    getMyItems(options?: ProcessMyItemsOptions): Promise<ProcessQueryResponse> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_MY_ITEMS, {
            flowId: this._id,
            status: options?.status || "draft",
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
            filters: options?.filters || {},
            sortBy: options?.sortBy || []
        });
    }

    /**
     * Get my pending tasks from this process (tasks assigned to me)
     * @param options - Query options (activityId, searchValue, pageNumber, pageSize, filters, sortBy)
     * @returns Promise containing tasks and total count
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * // Get all pending tasks
     * const { items } = await process.getMyTasks();
     * // Get tasks for specific activity/step
     * const { items } = await process.getMyTasks({ activityId: "Approval_Step" });
     */
    getMyTasks(options?: ProcessMyTasksOptions): Promise<ProcessQueryResponse> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_MY_TASKS, {
            flowId: this._id,
            activityId: options?.activityId || "",
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
            filters: options?.filters || {},
            sortBy: options?.sortBy || []
        });
    }

    /**
     * Get items I participated in (items where I took action)
     * @param options - Query options (searchValue, pageNumber, pageSize, filters, sortBy)
     * @returns Promise containing items and total count
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * const { items } = await process.getParticipated();
     */
    getParticipated(options?: ProcessParticipatedOptions): Promise<ProcessQueryResponse> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_PARTICIPATED, {
            flowId: this._id,
            activityId: options?.activityId || "",
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
            filters: options?.filters || {},
            sortBy: options?.sortBy || []
        });
    }

    /**
     * Get all items as admin (requires admin access)
     * @param options - Query options (searchValue, pageNumber, pageSize, filters, sortBy)
     * @returns Promise containing items and total count
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * const { items } = await process.getAdminItems();
     */
    getAdminItems(options?: ProcessAdminOptions): Promise<ProcessQueryResponse> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_ADMIN_ITEMS, {
            flowId: this._id,
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
            filters: options?.filters || {},
            sortBy: options?.sortBy || []
        });
    }

    /**
     * Create a new process instance (start a new process)
     * @param options - Creation options (data: initial field values)
     * @returns Promise containing the newly created process item with _id and _activity_instance_id
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * const item = await process.createItem({ data: { LeaveType: "Annual" } });
     */
    createItem(options?: ProcessCreateItemOptions): Promise<ProcessItem> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_CREATE_ITEM, {
            flowId: this._id,
            data: options?.data || {}
        });
    }

    /**
     * Update an existing process instance
     * @param options - Update options (instanceId, activityInstanceId, data)
     * @returns Promise containing the updated item
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * await process.updateItem({
     *   instanceId: "item_123",
     *   activityInstanceId: "activity_456",
     *   data: { LeaveType: "Sick" }
     * });
     */
    updateItem(options: ProcessUpdateItemOptions): Promise<ProcessItem> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.activityInstanceId, name: "activityInstanceId" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_UPDATE_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId,
            data: options.data
        });
    }

    /**
     * Delete a process instance
     * @param options - Delete options (instanceId)
     * @returns Promise resolving on successful deletion
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * await process.deleteItem({ instanceId: "item_123" });
     */
    deleteItem(options: ProcessDeleteItemOptions): Promise<void> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_DELETE_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId
        });
    }

    /**
     * Initialize a form for a process instance with all necessary setup
     * Fetches schema, item data, creates and initializes the form store
     *
     * @param instanceId - Optional instance ID. If omitted, creates a new process instance
     * @param activityInstanceId - Optional activity instance ID. Required when editing existing instance
     * @returns Promise with Form instance ready to use
     *
     * @example
     * // Create new process instance
     * const process = kf.app.getProcess("LeaveRequest");
     * const form = await process.initForm();
     * await form.updateField({ LeaveType: "Annual" });
     *
     * // Edit existing process instance
     * const form = await process.initForm("item_123", "activity_456");
     * const data = await form.toJSON();
     */
    initForm(instanceId?: string, activityInstanceId?: string): Promise<Form> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_INIT_FORM, {
            flowId: this._id,
            instanceId: instanceId || "",
            activityInstanceId: activityInstanceId || ""
        }).then((response: any) => {
            return new Form(response.storeId || instanceId || "", this._id);
        });
    }

    /**
     * Get field options for dropdown/lookup fields
     * @param options - Field options (instanceId, activityInstanceId, fieldId)
     * @returns Promise containing the field options
     *
     * @example
     * const process = kf.app.getProcess("LeaveRequest");
     * const options = await process.getFieldOptions({
     *   instanceId: "item_123",
     *   fieldId: "LeaveType"
     * });
     */
    getFieldOptions(options: ProcessFieldOptions): Promise<any> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.fieldId, name: "fieldId" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_FIELD_OPTIONS, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId || "",
            fieldId: options.fieldId
        });
    }

    /**
     * Open the form UI for a process instance
     * @param item - Process item with _id and _activity_instance_id
     */
    openForm(item: ProcessItem) {
        const error = requireFieldsAsync([
            { value: item._id, name: "Instance Id (_id)" },
            { value: item._activity_instance_id, name: "Activity Instance Id (_activity_instance_id)" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_OPEN_FORM, {
            flowId: this._id,
            instanceId: item._id,
            activityInstanceId: item._activity_instance_id,
        });
    }
}
