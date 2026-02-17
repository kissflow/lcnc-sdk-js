// ============================================
// Shared Base Types
// ============================================

export type SortField = {
  field: string;
  isDescending: boolean;
};

export type QueryResponse = {
  items: any[];
  total: number;
  page?: number;
  pageSize?: number;
};

export type BaseQueryOptions = {
  searchValue?: string;
  pageNumber?: number;
  pageSize?: number;
  filters?: object;
  sortBy?: SortField[];
};

// ============================================
// Core Types
// ============================================

export type userObject = {
  _id: string;
  Name: string;
  Email: string;
  /** @deprecated Use AppRoles instead. */
  Role: string;
  AppRoles: rolesObject[];
};

export type rolesObject = {
  _id: string;
  Name: string;
};

export type accountObject = {
  _id: string;
};

export type environmentObject = {
  isMobile: boolean;
};

export type BoardItem = {
  _id: string;
  _view_id: string;
};

export type DataformItem = {
  _id: string;
};

export type DataformFieldOptions = {
  flowId: string;
  instanceId: string;
  fieldId: string;
};

export type ProcessItem = {
  _id: string;
  _activity_instance_id: string;
};

// ============================================
// Process Types
// ============================================

export type ProcessMyItemsOptions = BaseQueryOptions & {
  status?: string;  // "draft" | "inprogress" | "completed" | "rejected"
};

export type ProcessMyTasksOptions = BaseQueryOptions & {
  activityId?: string;  // Filter by specific activity/step
};

export type ProcessParticipatedOptions = BaseQueryOptions & {
  activityId?: string;  // Filter by specific activity/step
};

export type ProcessAdminOptions = BaseQueryOptions;

export type ProcessQueryResponse = QueryResponse;

export type ProcessCreateItemOptions = {
  data?: object;
};

export type ProcessUpdateItemOptions = {
  instanceId: string;
  activityInstanceId: string;
  data: object;
};

export type ProcessDeleteItemOptions = {
  instanceId: string;
};

export type ProcessFieldOptions = {
  instanceId: string;
  activityInstanceId?: string;
  fieldId: string;
};

export type FetchOptions = {
  method?: string;
  body?: string | object;
  headers?: object;
};

// ============================================
// Dataform Types
// ============================================

export type DataformQueryOptions = BaseQueryOptions;

export type DataformQueryResponse = QueryResponse;

export type DataformCreateItemOptions = {
  data?: object;
  viewId?: string;
};

export type DataformUpdateItemOptions = {
  itemId: string;  // Required: the _id of the item to update
  data: object;    // Required: the updated field values
  viewId?: string; // Optional: view ID for view-specific update
};

// ============================================
// Board Types
// ============================================

export type BoardGetItemsOptions = BaseQueryOptions & {
  viewId: string;  // Required: view ID for fetching items
  payload?: object;
};

export type BoardGetItemsCountOptions = {
  viewId: string;  // Required: view ID for fetching count
  payload?: object;
};

export type BoardQueryResponse = QueryResponse;

export type BoardCountResponse = {
  count: number;
};

export type BoardCreateItemOptions = {
  data?: object;
};

export type BoardUpdateItemOptions = {
  instanceId: string;  // Required: the _id of the item to update
  data: object;        // Required: the updated field values
};

export type BoardDeleteItemOptions = {
  instanceId: string;  // Required: the _id of the item to delete
};

export type BoardFieldOptions = {
  instanceId: string;
  fieldId: string;
};
