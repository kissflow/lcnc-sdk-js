// ============================================
// Shared Base Types
// ============================================

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
};

export type PayloadSortItem = {
  Id: string;
  SortType: "ASC" | "DESC";
};

export type PayloadOptions = {
  Columns?: any[];
  Filters?: any;
  Sort?: PayloadSortItem[];
  FilterParam?: any;
};

export type ProcessPayloadOptions = {
  Columns?: any[];
  Filters?: any;
  Sort?: PayloadSortItem[];
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


export type ProcessItem = {
  _id: string;
  _activity_instance_id: string;
};

// ============================================
// Process Types
// ============================================

export type ProcessMyItemsOptions = BaseQueryOptions & {
  status?: string;  // "draft" | "inprogress" | "completed" | "rejected"
  payload?: ProcessPayloadOptions;
};

export type ProcessMyTasksOptions = BaseQueryOptions & {
  activityId?: string;
  payload?: ProcessPayloadOptions;
};

export type ProcessParticipatedOptions = BaseQueryOptions & {
  activityId?: string;
  payload?: ProcessPayloadOptions;
};

export type ProcessAdminOptions = BaseQueryOptions & {
  payload?: ProcessPayloadOptions;
};

export type ProcessQueryResponse = QueryResponse;

export type ProcessGetItemOptions = {
  instanceId: string;
};

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

export type ProcessSubmitItemOptions = {
  instanceId: string;
  activityInstanceId: string;
  comment?: string;
};

export type ProcessRejectItemOptions = {
  instanceId: string;
  activityInstanceId: string;
  comment: string;
};

export type ProcessWithdrawItemOptions = {
  instanceId: string;
  comment?: string;
};

export type ProcessSendbackItemOptions = {
  instanceId: string;
  activityInstanceId: string;
  stepId: string;
  comment: string;
};

export type ProcessReassignItemOptions = {
  instanceId: string;
  activityInstanceId: string;
  reassignTo: object;
  comment: string;
  reassignType?: "initiator" | "approver" | "admin";
  reassignedFrom?: object[];
};

export type ProcessGetReassigneesOptions = {
  instanceId: string;
  activityInstanceId: string;
  pageNumber?: number;
  pageSize?: number;
  query?: string;
};

export type ProcessRestartItemOptions = {
  instanceId: string;
  activityInstanceId: string;
};

export type ProcessDiscardItemOptions = {
  instanceId: string;
};

export type FetchOptions = {
  method?: string;
  body?: string | object;
  headers?: object;
};

// ============================================
// Dataform Types
// ============================================

export type DataformQueryOptions = BaseQueryOptions & {
  viewId?: string;
  payload?: PayloadOptions;
};

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

export type DataformGetItemOptions = {
  itemId: string;
  viewId?: string;
};

export type DataformDeleteItemOptions = {
  itemId: string;
  viewId?: string;
};

export type DataformDiscardItemOptions = {
  viewId?: string;
};

export type DataformSubmitItemOptions = {
  itemId: string;
  data?: object;
  viewId?: string;
};

// ============================================
// Board Types
// ============================================

export type BoardGetItemsOptions = BaseQueryOptions & {
  viewId: string;  // Required: view ID for fetching items
  payload?: PayloadOptions;
};

export type BoardQueryResponse = QueryResponse;

export type BoardGetItemOptions = {
  instanceId: string;
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

export type BoardSubmitItemOptions = {
  instanceId: string;
  comment?: string;
};

export type BoardDiscardItemOptions = {
  instanceId: string;
};



