import { BaseSDK, LISTENER_CMDS } from "../core";
import { requireFieldAsync } from "../utils/validation";
import {
	DataformItem,
	DataformQueryOptions,
	DataformQueryResponse,
	DataformCreateItemOptions,
	DataformUpdateItemOptions,
	DataformGetItemOptions,
	DataformDeleteItemOptions,
	DataformDiscardItemOptions,
	DataformSubmitItemOptions
} from "../types/external";

export class Dataform extends BaseSDK {
	private _id: string;

	constructor(flowId: string) {
		super();
		this._id = flowId;
	}

	/**
	 * Get all items from this dataform with optional filtering, sorting, and pagination
	 * @param options - Query options (searchValue, pageNumber, pageSize, payload)
	 * @returns Promise containing items and total count
	 */
	getItems(options?: DataformQueryOptions): Promise<DataformQueryResponse> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_ITEMS, {
			flowId: this._id,
			viewId: options?.viewId || "",
			searchValue: options?.searchValue || "",
			pageNumber: options?.pageNumber || 1,
			pageSize: options?.pageSize || 50,
			payload: options?.payload || {},
		});
	}

	/**
	 * Get a single item by ID from this dataform
	 * @param options - itemId (required), optional viewId
	 * @returns Promise containing the item data
	 */
	getItem(options: DataformGetItemOptions): Promise<DataformItem> {
		const error = requireFieldAsync(options.itemId, "itemId");
		if (error) return error;
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_ITEM, {
			flowId: this._id,
			itemId: options.itemId,
			viewId: options.viewId || ""
		});
	}

	/**
	 * Create a new item in this dataform
	 * @param options - Creation options (data: initial field values, viewId: optional view ID)
	 * @returns Promise containing the newly created item with _id
	 */
	createItem(options?: DataformCreateItemOptions): Promise<DataformItem> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_CREATE_ITEM, {
			flowId: this._id,
			data: options?.data || {},
			viewId: options?.viewId || ""
		});
	}

	/**
	 * Update an existing item in this dataform
	 * @param options - Update options (itemId: required, data: required updated values, viewId: optional view ID)
	 * @returns Promise containing the updated item
	 */
	updateItem(options: DataformUpdateItemOptions): Promise<DataformItem> {
		const error = requireFieldAsync(options.itemId, "itemId");
		if (error) return error;
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_UPDATE_ITEM, {
			flowId: this._id,
			itemId: options.itemId,
			data: options.data,
			viewId: options.viewId || ""
		});
	}

	/**
	 * Import items from a CSV file into this dataform
	 * @param defaultValues - Optional default field values to apply to all imported items
	 */
	importCSV(defaultValues?: object) {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_IMPORT_CSV, {
			flowId: this._id,
			defaultValues
		});
	}

	/**
	 * Open the form UI for an existing dataform item
	 * @param item - Dataform item with _id
	 */
	openForm(item: DataformItem) {
		const error = requireFieldAsync(item._id, "Instance Id (_id)");
		if (error) return error;
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_OPEN_FORM, {
			flowId: this._id,
			itemId: item._id,
			fullscreen: item.fullscreen || false
		});
	}

	/**
	 * Delete an item from this dataform
	 * @param options - itemId (required), optional viewId
	 *
	 * @example
	 * await dataform.deleteItem({ itemId: "item_123" });
	 */
	deleteItem(options: DataformDeleteItemOptions): Promise<void> {
		const error = requireFieldAsync(options.itemId, "itemId");
		if (error) return error;
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_DELETE_ITEM, {
			flowId: this._id,
			itemId: options.itemId,
			viewId: options.viewId || ""
		});
	}

	/**
	 * Discard the current draft for this dataform
	 * @param options - optional viewId
	 *
	 * @example
	 * await dataform.discardItem();
	 */
	discardItem(options?: DataformDiscardItemOptions): Promise<void> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_DISCARD_ITEM, {
			flowId: this._id,
			viewId: options?.viewId || ""
		});
	}

	/**
	 * Submit/finalize a dataform item
	 * @param options - itemId (required), optional data and viewId
	 *
	 * @example
	 * await dataform.submitItem({ itemId: "item_123" });
	 */
	submitItem(options: DataformSubmitItemOptions): Promise<void> {
		const error = requireFieldAsync(options.itemId, "itemId");
		if (error) return error;
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_SUBMIT_ITEM, {
			flowId: this._id,
			itemId: options.itemId,
			data: options.data || {},
			viewId: options.viewId || ""
		});
	}

	/**
	 * Get field definitions for this dataform
	 * @param options - Optional viewId to scope fields to a specific view
	 */
	getFields(options?: { viewId?: string }): Promise<any> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_FIELDS, {
			flowId: this._id,
			viewId: options?.viewId || ""
		});
	}

}
