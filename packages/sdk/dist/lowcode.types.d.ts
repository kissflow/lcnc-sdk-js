
declare class Form { 
	type: string 
	toJSON(): any; 
	getField(fieldId: string): any; 
	updateField(args: object): any; 
	getValidationErrors(): any; 
	getFormConfiguration(): any; 
	getTable(tableId: string): Table; 
}
declare class Table { 
	toJSON(): any; 
	getSelectedRows(): any; 
	getRows(): TableForm[]; 
	getRow(rowId: string): TableForm; 
	addRow(rowObject: object): any; 
	addRows(rows: object[]): any; 
	deleteRow(rowId: string): any; 
	deleteRows(rows: string[]): any; 
}
declare class TableForm { 
	type: string 
	getParent(): Form; 
	toJSON(): any; 
	getField(fieldId: string): any; 
	updateField(args: object): any; 
}
declare class Client { 
	showInfo(message: string | object): any; 
	showConfirm(args: {
            title: string;
            content: string;
            okText: string;
            cancelText: string;
        }): any; 
	redirect(url: string): any; 
}
declare class Formatter { 
	toDate(date: string): any; 
	toDateTime(date: string): any; 
	toNumber(value: string): any; 
	toCurrency(value: string, currencyCode: string): any; 
	toBoolean(value: string): any; 
}
declare class Component { 
	_id: string 
	type: string 
	onMount(callback: Function): void; 
	refresh(): any; 
	/** @deprecated Use condition visibility instead. */
        show(): any; 
	/** @deprecated Use condition visibility instead. */
        hide(): any; 
}
declare class Popup { 
	_id: string 
	type: string 
	getParameter(key: string): any; 
	getAllParameters(): any; 
	close(): any; 
	getComponent(componentId: string): Component; 
}
declare class Page { 
	_id: string 
	popup: Popup 
	type: string 
	getParameter(key: string): any; 
	getAllParameters(): any; 
	getVariable(key: string): any; 
	setVariable(key: string | object, value?: any): any; 
	openPopup(popupId: string, popupParams?: object): any; 
	getComponent(componentId: string): Component; 
}
declare class DecisionTable { 
	evaluate(payload?: object): any; 
}
declare class Dataform { 
	/**
         * Get all items from this dataform with optional filtering, sorting, and pagination
         * @param options - Query options (searchValue, pageNumber, pageSize, filters, sortBy)
         * @returns Promise containing items and total count
         */
        getItems(options?: DataformQueryOptions): Promise<DataformQueryResponse>; 
	/**
         * Create a new item in this dataform
         * @param options - Creation options (data: initial field values, viewId: optional view ID)
         * @returns Promise containing the newly created item with _id
         */
        createItem(options?: DataformCreateItemOptions): Promise<DataformItem>; 
	/**
         * Update an existing item in this dataform
         * @param options - Update options (itemId: required, data: required updated values, viewId: optional view ID)
         * @returns Promise containing the updated item
         */
        updateItem(options: DataformUpdateItemOptions): Promise<DataformItem>; 
	importCSV(defaultValues?: object): any; 
	openForm(item: DataformItem): any; 
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
        getForm(instanceId: string): Form; 
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
        initForm(instanceId?: string): Promise<Form>; 
	getFieldOptions(options?: DataformFieldOptions): Promise<DataformQueryResponse>; 
}
declare class Board { 
	/**
         * Import data from CSV file
         * @param defaultValues - Optional default values to apply to imported items
         */
        importCSV(defaultValues?: object): any; 
	/**
         * Open the form UI for a board item
         * @param item - Board item with _id and optional _view_id
         */
        openForm(item: BoardItem): any; 
	/**
         * Get items from a board view
         * @param options - Query options (viewId required, searchValue, pageNumber, pageSize, filters, sortBy, payload)
         * @returns Promise containing items array and total count
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * const { items } = await board.getItems({ viewId: "AllItems_View" });
         */
        getItems(options: BoardGetItemsOptions): Promise<BoardQueryResponse>; 
	/**
         * Get items count from a board view
         * @param options - Query options (viewId required, payload optional)
         * @returns Promise containing count
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * const { count } = await board.getItemsCount({ viewId: "AllItems_View" });
         */
        getItemsCount(options: BoardGetItemsCountOptions): Promise<BoardCountResponse>; 
	/**
         * Create a new board item
         * @param options - Creation options (data: initial field values)
         * @returns Promise containing the newly created item with _id
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * const item = await board.createItem({ data: { Name: "New Item" } });
         */
        createItem(options?: BoardCreateItemOptions): Promise<BoardItem>; 
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
        updateItem(options: BoardUpdateItemOptions): Promise<BoardItem>; 
	/**
         * Delete a board item
         * @param options - Delete options (instanceId)
         * @returns Promise resolving on successful deletion
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * await board.deleteItem({ instanceId: "item_123" });
         */
        deleteItem(options: BoardDeleteItemOptions): Promise<void>; 
	/**
         * Initialize a form for a board item with all necessary setup
         * Fetches schema, item data, creates and initializes the form store
         *
         * @param instanceId - Optional instance ID. If omitted, creates a new board item
         * @returns Promise with Form instance ready to use
         *
         * @example
         * // Create new board item
         * const board = kf.app.getBoard("Inventory");
         * const form = await board.initForm();
         * await form.updateField({ Name: "New Item" });
         *
         * // Edit existing board item
         * const form = await board.initForm("item_123");
         * const data = await form.toJSON();
         */
        initForm(instanceId?: string): Promise<Form>; 
	/**
         * Get field options for dropdown/lookup fields
         * @param options - Field options (instanceId, fieldId)
         * @returns Promise containing the field options
         *
         * @example
         * const board = kf.app.getBoard("Inventory");
         * const options = await board.getFieldOptions({
         *   instanceId: "item_123",
         *   fieldId: "Category"
         * });
         */
        getFieldOptions(options: BoardFieldOptions): Promise<any>; 
}
declare class Process { 
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
        getMyItems(options?: ProcessMyItemsOptions): Promise<ProcessQueryResponse>; 
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
        getMyTasks(options?: ProcessMyTasksOptions): Promise<ProcessQueryResponse>; 
	/**
         * Get items I participated in (items where I took action)
         * @param options - Query options (searchValue, pageNumber, pageSize, filters, sortBy)
         * @returns Promise containing items and total count
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * const { items } = await process.getParticipated();
         */
        getParticipated(options?: ProcessParticipatedOptions): Promise<ProcessQueryResponse>; 
	/**
         * Get all items as admin (requires admin access)
         * @param options - Query options (searchValue, pageNumber, pageSize, filters, sortBy)
         * @returns Promise containing items and total count
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * const { items } = await process.getAdminItems();
         */
        getAdminItems(options?: ProcessAdminOptions): Promise<ProcessQueryResponse>; 
	/**
         * Create a new process instance (start a new process)
         * @param options - Creation options (data: initial field values)
         * @returns Promise containing the newly created process item with _id and _activity_instance_id
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * const item = await process.createItem({ data: { LeaveType: "Annual" } });
         */
        createItem(options?: ProcessCreateItemOptions): Promise<ProcessItem>; 
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
        updateItem(options: ProcessUpdateItemOptions): Promise<ProcessItem>; 
	/**
         * Delete a process instance
         * @param options - Delete options (instanceId)
         * @returns Promise resolving on successful deletion
         *
         * @example
         * const process = kf.app.getProcess("LeaveRequest");
         * await process.deleteItem({ instanceId: "item_123" });
         */
        deleteItem(options: ProcessDeleteItemOptions): Promise<void>; 
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
        initForm(instanceId?: string, activityInstanceId?: string): Promise<Form>; 
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
        getFieldOptions(options: ProcessFieldOptions): Promise<any>; 
	/**
         * Open the form UI for a process instance
         * @param item - Process item with _id and _activity_instance_id
         */
        openForm(item: ProcessItem): any; 
}
declare class Application { 
	page: Page 
	_id: string 
	getVariable(key: string): any; 
	setVariable(key: string | object, value?: any): any; 
	openPage(pageId: string, pageParams?: object): any; 
	getDecisionTable(flowId: string): DecisionTable; 
	getDataform(flowId: string): Dataform; 
	getBoard(flowId: string): Board; 
	getProcess(flowId: string): Process; 
}
declare class kf { 
	static context: Component 
	static client: Client 
	static formatter: Formatter 
	static app: Application 
	static user: userObject 
	static env: environmentObject 
	static account: accountObject 
	static eventParameters: any 
	static api(url: string, args?: FetchOptions): Promise<any>; 
}
// ============================================
// Shared Base Types
// ============================================

declare type SortField = {
  field: string;
  isDescending: boolean;
};

declare type QueryResponse = {
  items: any[];
  total: number;
  page?: number;
  pageSize?: number;
};

declare type BaseQueryOptions = {
  searchValue?: string;
  pageNumber?: number;
  pageSize?: number;
  filters?: object;
  sortBy?: SortField[];
};

// ============================================
// Core Types
// ============================================

declare type userObject = {
  _id: string;
  Name: string;
  Email: string;
  /** @deprecated Use AppRoles instead. */
  Role: string;
  AppRoles: rolesObject[];
};

declare type rolesObject = {
  _id: string;
  Name: string;
};

declare type accountObject = {
  _id: string;
};

declare type environmentObject = {
  isMobile: boolean;
};

declare type BoardItem = {
  _id: string;
  _view_id: string;
};

declare type DataformItem = {
  _id: string;
};

declare type DataformFieldOptions = {
  flowId: string;
  instanceId: string;
  fieldId: string;
};

declare type ProcessItem = {
  _id: string;
  _activity_instance_id: string;
};

// ============================================
// Process Types
// ============================================

declare type ProcessMyItemsOptions = BaseQueryOptions & {
  status?: string;  // "draft" | "inprogress" | "completed" | "rejected"
};

declare type ProcessMyTasksOptions = BaseQueryOptions & {
  activityId?: string;  // Filter by specific activity/step
};

declare type ProcessParticipatedOptions = BaseQueryOptions & {
  activityId?: string;  // Filter by specific activity/step
};

declare type ProcessAdminOptions = BaseQueryOptions;

declare type ProcessQueryResponse = QueryResponse;

declare type ProcessCreateItemOptions = {
  data?: object;
};

declare type ProcessUpdateItemOptions = {
  instanceId: string;
  activityInstanceId: string;
  data: object;
};

declare type ProcessDeleteItemOptions = {
  instanceId: string;
};

declare type ProcessFieldOptions = {
  instanceId: string;
  activityInstanceId?: string;
  fieldId: string;
};

declare type FetchOptions = {
  method?: string;
  body?: string | object;
  headers?: object;
};

// ============================================
// Dataform Types
// ============================================

declare type DataformQueryOptions = BaseQueryOptions;

declare type DataformQueryResponse = QueryResponse;

declare type DataformCreateItemOptions = {
  data?: object;
  viewId?: string;
};

declare type DataformUpdateItemOptions = {
  itemId: string;  // Required: the _id of the item to update
  data: object;    // Required: the updated field values
  viewId?: string; // Optional: view ID for view-specific update
};

// ============================================
// Board Types
// ============================================

declare type BoardGetItemsOptions = BaseQueryOptions & {
  viewId: string;  // Required: view ID for fetching items
  payload?: object;
};

declare type BoardGetItemsCountOptions = {
  viewId: string;  // Required: view ID for fetching count
  payload?: object;
};

declare type BoardQueryResponse = QueryResponse;

declare type BoardCountResponse = {
  count: number;
};

declare type BoardCreateItemOptions = {
  data?: object;
};

declare type BoardUpdateItemOptions = {
  instanceId: string;  // Required: the _id of the item to update
  data: object;        // Required: the updated field values
};

declare type BoardDeleteItemOptions = {
  instanceId: string;  // Required: the _id of the item to delete
};

declare type BoardFieldOptions = {
  instanceId: string;
  fieldId: string;
};
