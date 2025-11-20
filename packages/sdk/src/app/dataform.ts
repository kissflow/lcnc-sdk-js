import { BaseSDK, LISTENER_CMDS } from "../core";
import {
	DataformItem,
	DataformQueryOptions,
	DataformQueryResponse,
	DataformCreateItemOptions
} from "../types/external";

export class Dataform extends BaseSDK {
	private _id: string;

	constructor(flowId: string) {
		super();
		this._id = flowId;
	}

	/**
	 * Get all items from this dataform with optional filtering, sorting, and pagination
	 * @param options - Query options (searchValue, pageNumber, pageSize, filters, sortBy)
	 * @returns Promise containing items and total count
	 */
	getItems(options?: DataformQueryOptions): Promise<DataformQueryResponse> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_ITEMS, {
			flowId: this._id,
			searchValue: options?.searchValue || "",
			pageNumber: options?.pageNumber || 1,
			pageSize: options?.pageSize || 50,
			filters: options?.filters || {},
			sortBy: options?.sortBy || []
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

	importCSV(defaultValues?: object) {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_IMPORT_CSV, {
			flowId: this._id,
			defaultValues
		});
	}

	openForm(item: DataformItem) {
		if (!item._id) {
			return Promise.reject({
				message: "Instance Id (_id) is required"
			});
		}
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_OPEN_FORM, {
			flowId: this._id,
			itemId: item._id
		});
	}
}
