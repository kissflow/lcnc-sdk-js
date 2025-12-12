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

export type FetchOptions = {
  method?: string;
  body?: string | object;
  headers?: object;
};

export type DataformQueryOptions = {
  searchValue?: string;
  pageNumber?: number;
  pageSize?: number;
  filters?: object;
  sortBy?: Array<{ field: string; isDescending: boolean }>;
};

export type DataformQueryResponse = {
  items: any[];
  total: number;
  page?: number;
  pageSize?: number;
};

export type DataformCreateItemOptions = {
  data?: object;
  viewId?: string;
};

export type DataformUpdateItemOptions = {
  itemId: string;  // Required: the _id of the item to update
  data: object;    // Required: the updated field values
  viewId?: string; // Optional: view ID for view-specific update
};
