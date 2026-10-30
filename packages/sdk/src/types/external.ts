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

export type ProcessFieldOptions = {
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

// ============================================
// Report Types
// ============================================

export type ReportFlowType = "Form" | "Process" | "Case";

// The request body of a report read. Only FilterParam is read: it sets the report's open parameters, each named with
// a leading $ and sent as text ({ "$status": "Completed" }). Any other key is ignored.
export type ReportPayload = {
    FilterParam?: Record<string, string | string[] | object>;
};

export type ReportQueryOptions = {
    pageNumber?: number;
    pageSize?: number;
    payload?: ReportPayload;
};

export type ReportCountOptions = {
    payload?: ReportPayload;
};

// A field of a tabular report. The report service may add keys such as Type.
export type ReportField = {
    Id: string;
    Name: string;
    [key: string]: any;
};

// Which of these keys come back depends on the report's type: a chart has Columns and Values (and Rows with a
// series), a card has FieldMapping and Values (its Data is empty when nothing matches), a tabular report has
// Columns, Id and Name, a pivot has Columns, Rows, Values and Formatting. Each Data row is keyed by the Id of its
// Columns, Rows or Values entry.
export type ReportDataResponse = {
    Data: any[];
    Columns?: any[];
    Rows?: any[];
    Values?: any[];
    FieldMapping?: any[];
    Formatting?: any[];
    Id?: string;
    Name?: string;
    [key: string]: any;
};

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

export type DataformFieldOptions = {
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

export type BoardFieldOptions = {
    instanceId: string;
    fieldId: string;
    /** Skip the server-side model lookup by supplying the field's type directly. */
    fieldType?: string;
    tableId?: string;
    tableRowId?: string;
};

/** The terminal states a Custom Function run ends in, plus the two it passes through. */
export type RunStatus = "Queued" | "Running" | "Success" | "Failed" | "TimedOut";

/**
 * What a Custom Function run looks like from the SDK.
 *
 * An Interactive function resolves with the terminal envelope directly. A
 * Background function resolves with `Queued` and only `RunId`; fetch the rest
 * with `getFunctionRun`, or wait for it with `onFunctionRunComplete`.
 */
export type RunEnvelope = {
	RunId: string;
	Status: RunStatus;
	/** Whatever the function returned. Only constrained when its output contract names properties. */
	Result?: unknown;
	Error?: { Code?: string; Message: string };
};

/**
 * How a Custom Function call fails: `error` is the message text and `errorCode` either the platform
 * code (`KISSFLOW_ERROR_…`) or a `FUNCTION_…` code, including `FUNCTION_HOST_TIMEOUT`,
 * `FUNCTION_REQUEST_NOT_SENT`, `FUNCTION_RUN_OUTCOME_UNKNOWN` (a run may have started),
 * `FUNCTION_RUN_NOT_SENT` (no run started), `FUNCTION_HOST_UNSUPPORTED`, `FUNCTION_WATCH_INVALID_EVENT`
 * and `FUNCTION_OBSERVATION_STOPPED`. The list may grow; fall back to `error` for an unknown code.
 */
export type RunWatchError = { isError: true; error?: string; errorCode?: string };

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
