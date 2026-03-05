import { BaseSDK, LISTENER_CMDS } from "../core";
import { Form } from "../form";
import {
	DataformItem,
	DataformQueryOptions,
	DataformQueryResponse,
	DataformCreateItemOptions,
	DataformUpdateItemOptions,
	DataformFieldOptions,
	DataformGetItemOptions,
	DataformDeleteItemOptions,
	DataformDiscardOptions,
	DataformSubmitOptions
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
			viewId: options?.viewId || "",
			payload: options?.payload || {},
			searchValue: options?.searchValue || "",
			pageNumber: options?.pageNumber || 1,
			pageSize: options?.pageSize || 50,
			filters: options?.filters || {},
			sortBy: options?.sortBy || []
		});
	}

	/**
	 * Get a single item by ID from this dataform
	 * @param options - itemId (required), optional viewId
	 * @returns Promise containing the item data
	 */
	getItem(options: DataformGetItemOptions): Promise<DataformItem> {
		if (!options.itemId) {
			return Promise.reject({ message: "itemId is required" });
		}
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
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_UPDATE_ITEM, {
			flowId: this._id,
			itemId: options.itemId,
			data: options.data,
			viewId: options.viewId || ""
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

	/**
	 * Get a form instance for a specific dataform record
	 * This returns a Form instance that uses the shared form store
	 * allowing you to manage dataform records with form SDK methods
	 *
	 * @param instanceId - The instance ID of the dataform record
	 * @returns Form instance for managing the record
	 *
	 * @example
	 * const dataform = kf.app.getDataform("EmpMaster");
	 * const form = dataform.getForm("emp_123");
	 * const data = await form.toJSON();
	 * await form.updateField({ firstName: "John" });
	 */
	//TO BE REMOVED
	getForm(instanceId: string): Form {
		return new Form(instanceId, this._id);
	}

	/**
	 * Initialize a form with all necessary data (schema, item data, form store)
	 * This is the recommended way to create a custom form for dataform records
	 * It automatically handles fetching schema, item data, and initializing the form store
	 *
	 * @param instanceId - Optional instance ID of the dataform record. If omitted, creates a new record
	 * @returns Promise with Form instance ready to use
	 *
	 * @example
	 * // Load existing record
	 * const dataform = kf.app.getDataform("EmpMaster");
	 * const form = await dataform.initForm("emp_123");
	 * const data = await form.toJSON();
	 *
	 * // Create new record
	 * const form = await dataform.initForm();
	 * await form.updateField({ firstName: "John" });
	 */
	initForm(instanceId?: string): Promise<Form> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_INIT_FORM, {
			flowId: this._id,
			instanceId: instanceId || ""
		}).then((response: any) => {
			// The response contains the storeId, return a Form instance
			return new Form((response.storeId || instanceId || ""), this._id );
		});
	}


	getFieldOptions(options?: DataformFieldOptions): Promise<DataformQueryResponse> {
			return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_FIELD_OPTIONS, {
				flowId: this._id,
				instanceId: options?.instanceId || "",
				fieldId: options?.fieldId || ""
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
		if (!options.itemId) {
			return Promise.reject({ message: "itemId is required" });
		}
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
	 * await dataform.discard();
	 */
	discard(options?: DataformDiscardOptions): Promise<void> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_DISCARD, {
			flowId: this._id,
			viewId: options?.viewId || ""
		});
	}

	/**
	 * Submit/finalize a dataform item
	 * @param options - itemId (required), optional data and viewId
	 *
	 * @example
	 * await dataform.submit({ itemId: "item_123" });
	 */
	submit(options: DataformSubmitOptions): Promise<void> {
		if (!options.itemId) {
			return Promise.reject({ message: "itemId is required" });
		}
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_SUBMIT, {
			flowId: this._id,
			itemId: options.itemId,
			data: options.data || {},
			viewId: options.viewId || ""
		});
	}

	getViewFields(options: { viewId: string }): Promise<any> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_VIEW_FIELDS, {
			flowId: this._id,
			viewId: options.viewId
		});
	}

	getFields(): Promise<any> {
		return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_FIELDS, {
			flowId: this._id
		});
	}

}
