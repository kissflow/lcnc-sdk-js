import { BaseSDK, LISTENER_CMDS } from "../core";
import {
    BoardItem,
    BoardGetItemOptions,
    BoardGetItemsOptions,
    BoardQueryResponse,
    BoardCreateItemOptions,
    BoardUpdateItemOptions,
    BoardDeleteItemOptions,
    BoardSubmitItemOptions,
    BoardDiscardItemOptions,
} from "../types/external";
import { requireFieldAsync } from "../utils/validation";

export class Board extends BaseSDK {
    private _id: string;

    constructor(flowId: string) {
        super();
        this._id = flowId;
    }

    /**
     * Import data from CSV file
     * @param defaultValues - Optional default values to apply to imported items
     */
    importCSV(defaultValues?: object) {
        return this._postMessageAsync(LISTENER_CMDS.BOARD_IMPORT_CSV, {
            flowId: this._id,
            defaultValues
        });
    }

    /**
     * Open the form UI for a board item
     * @param item - Board item with _id and optional _view_id
     */
    openForm(item: BoardItem) {
        const error = requireFieldAsync(item._id, "Instance Id (_id)");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.BOARD_OPEN_FORM, {
            flowId: this._id,
            itemId: item._id,
            viewId: item._view_id
        });
    }

    /**
     * Get items from a board view
     * @param options - Query options (viewId, searchValue, pageNumber, pageSize, payload)
     * @returns Promise containing items array and total count
     *
     * @example
     * const board = kf.app.getBoard("Inventory");
     * const { items } = await board.getItems({ viewId: "AllItems_View" });
     */
    getItems(options?: BoardGetItemsOptions): Promise<BoardQueryResponse> {
        return this._postMessageAsync(LISTENER_CMDS.BOARD_GET_ITEMS, {
            flowId: this._id,
            viewId: options?.viewId || "",
            searchValue: options?.searchValue || "",
            pageNumber: options?.pageNumber || 1,
            pageSize: options?.pageSize || 50,
            payload: options?.payload || {}
        });
    }


    /**
     * Get a single board/case item by instance ID
     * @param options - instanceId (required)
     * @returns Promise containing the item data
     */
    getItem(options: BoardGetItemOptions): Promise<BoardItem> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.BOARD_GET_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId
        });
    }

    /**
     * Create a new board item
     * @param options - Creation options (data: initial field values)
     * @returns Promise containing the newly created item with _id
     *
     * @example
     * const board = kf.app.getBoard("Inventory");
     * const item = await board.createItem({ data: { Name: "New Item" } });
     */
    createItem(options?: BoardCreateItemOptions): Promise<BoardItem> {
        return this._postMessageAsync(LISTENER_CMDS.BOARD_CREATE_ITEM, {
            flowId: this._id,
            data: options?.data || {}
        });
    }

    /**
     * Update an existing board item
     * @param options - Update options (instanceId, data)
     * @returns Promise containing the updated item
     *
     * @example
     * const board = kf.app.getBoard("Inventory");
     * await board.updateItem({
     *   instanceId: "item_123",
     *   data: { Name: "Updated Item" }
     * });
     */
    updateItem(options: BoardUpdateItemOptions): Promise<BoardItem> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.BOARD_UPDATE_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
            data: options.data
        });
    }

    /**
     * Delete a board item
     * @param options - Delete options (instanceId)
     * @returns Promise resolving on successful deletion
     *
     * @example
     * const board = kf.app.getBoard("Inventory");
     * await board.deleteItem({ instanceId: "item_123" });
     */
    deleteItem(options: BoardDeleteItemOptions): Promise<void> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.BOARD_DELETE_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId
        });
    }

    /**
     * Submit a board item
     * @param options - instanceId, optional comment
     */
    submitItem(options: BoardSubmitItemOptions): Promise<void> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.BOARD_SUBMIT_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId,
        });
    }

    /**
     * Discard a board item
     * @param options - instanceId
     */
    discardItem(options: BoardDiscardItemOptions): Promise<void> {
        const error = requireFieldAsync(options.instanceId, "instanceId");
        if (error) return error;
        return this._postMessageAsync(LISTENER_CMDS.BOARD_DISCARD_ITEM, {
            flowId: this._id,
            instanceId: options.instanceId
        });
    }

    getFields(options?: { viewId?: string }): Promise<any> {
        return this._postMessageAsync(LISTENER_CMDS.BOARD_GET_FIELDS, {
            flowId: this._id,
            viewId: options?.viewId || ""
        });
    }
}
