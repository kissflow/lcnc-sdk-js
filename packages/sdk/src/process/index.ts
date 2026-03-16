import { BaseSDK, LISTENER_CMDS } from "../core";
import {
    ProcessItem,
    ProcessGetItemOptions,
    ProcessMyItemsOptions,
    ProcessMyTasksOptions,
    ProcessParticipatedOptions,
    ProcessAdminOptions,
    ProcessQueryResponse,
    ProcessCreateItemOptions,
    ProcessUpdateItemOptions,
    ProcessDeleteItemOptions,
    ProcessSubmitItemOptions,
    ProcessRejectItemOptions,
    ProcessWithdrawItemOptions,
    ProcessSendbackItemOptions,
    ProcessReassignItemOptions,
    ProcessGetReassigneesOptions,
    ProcessRestartItemOptions,
    ProcessDiscardItemOptions
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
     * @param options - Query options (status, searchValue, pageNumber, pageSize, payload)
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
            payload: options?.payload || {}
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
    getMyTasksItems(options?: ProcessMyTasksOptions): Promise<ProcessQueryResponse> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_MY_TASKS_ITEMS, {
            flowId: this._id,
            activityId: options?.activityId || "",
            payload: options?.payload || {},
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
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
    getParticipatedItems(options?: ProcessParticipatedOptions): Promise<ProcessQueryResponse> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_PARTICIPATED_ITEMS, {
            flowId: this._id,
            activityId: options?.activityId || "",
            payload: options?.payload || {},
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
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
            payload: options?.payload || {},
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
        });
    }

    /**
     * Get a single process instance by ID
     * @param options - instanceId (required)
     * @returns Promise containing the instance data
     */
    getItem(options: ProcessGetItemOptions): Promise<ProcessItem> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId
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

    /**
     * Submit a process task
     * @param options - instanceId, activityInstanceId, optional comment
     *
     * @example
     * await process.submitItem({ instanceId: "item_123", activityInstanceId: "act_456" });
     */
    submitItem(options: ProcessSubmitItemOptions): Promise<void> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.activityInstanceId, name: "activityInstanceId" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_SUBMIT_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId,
            comment: options.comment || ""
        });
    }

    /**
     * Reject a process task
     * @param options - instanceId, activityInstanceId, comment (required)
     *
     * @example
     * await process.reject({ instanceId: "item_123", activityInstanceId: "act_456", comment: "Not approved" });
     */
    rejectItem(options: ProcessRejectItemOptions): Promise<void> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.activityInstanceId, name: "activityInstanceId" },
            { value: options.comment, name: "comment" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_REJECT_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId,
            comment: options.comment
        });
    }

    /**
     * Withdraw a process instance (initiator only)
     * @param options - instanceId, optional comment
     *
     * @example
     * await process.withdraw({ instanceId: "item_123", comment: "Withdrawing request" });
     */
    withdrawItem(options: ProcessWithdrawItemOptions): Promise<void> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_WITHDRAW_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            comment: options.comment || ""
        });
    }

    /**
     * Send back a process task to a previous step
     * @param options - instanceId, activityInstanceId, stepId (target step), comment (required)
     *
     * @example
     * await process.sendback({ instanceId: "item_123", activityInstanceId: "act_456", stepId: "step_789", comment: "Please revise" });
     */
    sendbackItem(options: ProcessSendbackItemOptions): Promise<void> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.activityInstanceId, name: "activityInstanceId" },
            { value: options.stepId, name: "stepId" },
            { value: options.comment, name: "comment" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_SENDBACK_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId,
            stepId: options.stepId,
            comment: options.comment
        });
    }

    /**
     * Reassign a process task to another user
     * @param options - instanceId, activityInstanceId, reassignTo (user object), comment (required), optional reassignType and reassignedFrom
     *
     * @example
     * await process.reassign({ instanceId: "item_123", activityInstanceId: "act_456", reassignTo: { _id: "user_789" }, comment: "Reassigning to manager" });
     */
    reassignItem(options: ProcessReassignItemOptions): Promise<void> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.activityInstanceId, name: "activityInstanceId" },
            { value: options.reassignTo, name: "reassignTo" },
            { value: options.comment, name: "comment" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_REASSIGN_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId,
            reassignTo: options.reassignTo,
            comment: options.comment,
            reassignType: options.reassignType || "approver",
            reassignedFrom: options.reassignedFrom || []
        });
    }

    /**
     * Get list of eligible reassignees for a process task
     * @param options - instanceId, activityInstanceId, optional pageNumber, pageSize, query
     */
    getReassignees(options: ProcessGetReassigneesOptions): Promise<any> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.activityInstanceId, name: "activityInstanceId" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_REASSIGNEES, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId,
            pageNumber: options.pageNumber || 1,
            pageSize: options.pageSize || 50,
            query: options.query
        });
    }

    /**
     * Restart a rejected/withdrawn process instance
     * @param options - instanceId, activityInstanceId
     *
     * @example
     * await process.restart({ instanceId: "item_123", activityInstanceId: "act_456" });
     */
    restartItem(options: ProcessRestartItemOptions): Promise<void> {
        const error = requireFieldsAsync([
            { value: options.instanceId, name: "instanceId" },
            { value: options.activityInstanceId, name: "activityInstanceId" }
        ]);
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_RESTART_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            activityInstanceId: options.activityInstanceId
        });
    }

    /**
     * Discard a draft process instance
     * @param options - instanceId
     *
     * @example
     * await process.discard({ instanceId: "item_123" });
     */
    discardItem(options: ProcessDiscardItemOptions): Promise<void> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_DISCARD_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId
        });
    }

    getFields(): Promise<any> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_FIELDS, {
            flowId: this._id
        });
    }

    getMyTaskFields(options: { activityId: string }): Promise<any> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_MYTASK_FIELDS, {
            flowId: this._id,
            activityId: options.activityId,
            isParticipated: false
        });
    }

    getParticipatedFields(options: { activityId: string }): Promise<any> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_PARTICIPATED_FIELDS, {
            flowId: this._id,
            activityId: options.activityId,
            isParticipated: true
        });
    }

    getMyItemsFields(options: { status: string }): Promise<any> {
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_MY_ITEMS_FIELDS, {
            flowId: this._id,
            status: options.status
        });
    }

    getProgress(options: { instanceId: string }): Promise<any> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_PROGRESS, {
            flowId: this._id,
            instanceId: options.instanceId
        });
    }
}
