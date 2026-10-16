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
    _view_id?: string;
};

export type ProcessItem = {
    _id: string;
    _activity_instance_id: string;
};

// ============================================
// Form Field Value Types
// ============================================

// The value shape a Geolocation field is stored/read as across the platform
// (native forms and custom forms alike) — Latitude/Longitude are stringified
// on save, matching the native Geolocation field's saved representation.
export type GeolocationValue = {
    Address?: string;
    Latitude: string;
    Longitude: string;
    City?: string;
    State?: string;
    Country?: string;
    ZipCode?: string;
    Area?: string;
    PlaceId?: string;
};

// ============================================
// Process Types
// ============================================

export type ProcessMyItemsOptions = BaseQueryOptions & {
    status?:
        | "draft"
        | "inprogress"
        | "completed"
        | "withdrawn"
        | "rejected"
        | "all";
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
    activityInstanceId: string;
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

export type ProcessGetAdminItemOptions = {
    instanceId: string;
};

export type ProcessUpdateAdminItemOptions = {
    instanceId: string;
    data: object;
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

export type ProcessFieldOptions = BaseQueryOptions & {
    instanceId: string;
    activityInstanceId: string;
    fieldId: string;
    /** Skip the server-side model lookup by supplying the field's type directly. */
    fieldType?: string;
    tableId?: string;
    tableRowId?: string;
};

export type ProcessAttachmentFile = {
    id: string;
    name: string;
    key: string;
    size?: number;
    fileExtension?: string;
};

export type ProcessParseAttachmentOptions = {
    instanceId: string; // form.instanceId (process record id)
    activityInstanceId: string;
    fieldId: string;
    file: ProcessAttachmentFile;
};

export type ProcessAttachmentParseResult = {
    appliedFields: string[]; // field IDs auto-filled into the form store
    suggestedBy: string; // name of the parsed file
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
    itemId: string; // Required: the _id of the item to update
    data: object; // Required: the updated field values
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

export type DataformFieldOptions = BaseQueryOptions & {
    instanceId: string;
    fieldId: string;
    /** Skip the server-side model lookup by supplying the field's type directly. */
    fieldType?: string;
    tableId?: string;
    tableRowId?: string;
};

// ============================================
// Board Types
// ============================================

export type BoardGetItemsOptions = BaseQueryOptions & {
    viewId?: string;
    payload?: PayloadOptions;
};

export type BoardQueryResponse = QueryResponse;

export type BoardGetItemOptions = {
    instanceId: string;
    viewId?: string;
};

export type BoardCreateItemOptions = {
    data?: object;
};

export type BoardUpdateItemOptions = {
    instanceId: string; // Required: the _id of the item to update
    data: object; // Required: the updated field values
};

export type BoardDeleteItemOptions = {
    instanceId: string; // Required: the _id of the item to delete
};

export type BoardSubmitItemOptions = {
    instanceId: string;
    comment?: string;
};

export type BoardDiscardItemOptions = {
    instanceId: string;
};

export type BoardFieldOptions = BaseQueryOptions & {
    instanceId: string;
    fieldId: string;
    /** Skip the server-side model lookup by supplying the field's type directly. */
    fieldType?: string;
    tableId?: string;
    tableRowId?: string;
};

// ============================================
// Custom Agent Types
// ============================================

export type AgentInputDataType = "Text" | "Number" | "Boolean" | "Attachment";

export type AgentOutputDataType = "string" | "number" | "boolean";

export type AgentInputField = {
    Key: string;
    Name: string;
    DataType: AgentInputDataType;
    Required: boolean;
    Description?: string;
};

export type AgentOutputField = {
    Key: string;
    Name: string;
    DataType: AgentOutputDataType;
    Description?: string;
};

/**
 * A file for an `Attachment` input: exactly one of `Key` (a Kissflow attachment) or `Url` (https).
 * A file from `openFilePicker` or `uploadFile` has lowercase keys: pass
 * `{ Key: file.key, FileName: file.name, Size: file.size }`.
 */
export type AgentAttachmentValue =
    | { Key: string; Url?: never; FileName: string; Size?: number; ContentType?: string }
    | { Url: string; Key?: never; FileName: string; Size?: number; ContentType?: string };

export type AgentInputValue = string | number | boolean | AgentAttachmentValue;

/** The Agent's published invocation contract. */
export type AgentContract = {
    AgentId: string;
    Definition: {
        Name: string;
        Description?: string;
        Icon?: Record<string, unknown>;
        Inputs: AgentInputField[];
        Outputs: AgentOutputField[];
        MaxOutputItems: number;
    };
    Readiness: {
        Ready: boolean;
        Issues: Array<{ Code: string; Path: string; Message: string }>;
    };
};

export type AgentExecuteOptions = {
    /** Values keyed by input `Key`, as declared in the contract. */
    inputData: Record<string, AgentInputValue>;
};

/** More statuses may be added; treat any status other than `Completed` or `Failed` as still in progress. */
export type AgentExecutionStatus = "Queued" | "NotStarted" | "Running" | "Completed" | "Failed" | (string & {});

/** What `execute` resolves with once the run is accepted, before it has finished. */
export type AgentExecutionAccepted = {
    ExecutionId: string;
    Status: AgentExecutionStatus;
};

export type AgentExecution = {
    ExecutionId: string;
    Status: AgentExecutionStatus;
    Stage?: string;
    /** Present on `Completed`: one row per item, keyed by output `Key`. */
    Output?: { items: Array<Record<string, string | number | boolean>> };
    /** Present on `Failed`. */
    Error?: { Code: string; Retryable: boolean; Details?: unknown };
    Warnings?: Array<Record<string, unknown>>;
    CreatedAt?: string;
    StartedAt?: string;
    CompletedAt?: string;
};

/**
 * How an Agent call fails: `error` is the message text and `errorCode` either the platform code
 * (`KISSFLOW_ERROR_…`) or an `AGENT_…` code, including `AGENT_HOST_TIMEOUT`, `AGENT_REQUEST_NOT_SENT`,
 * `AGENT_EXECUTE_OUTCOME_UNKNOWN` (a run may have started), `AGENT_EXECUTE_NOT_SENT` (no run started),
 * `AGENT_HOST_UNSUPPORTED`, `AGENT_WATCH_INVALID_EVENT`, `AGENT_OBSERVATION_STOPPED`, and from the host
 * `AGENT_READ_TIMEOUT` and `AGENT_OFFLINE`. The list may grow; fall back to `error` for an unknown code.
 * There is no `message`: read `error` for the text.
 */
export type AgentError = {
    isError: true;
    error?: string;
    errorCode?: string;
};
