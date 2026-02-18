var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _listeners, _textEncoder, _textDecoder, _registerComponentAPIs, registerComponentAPIs_fn, _csrfToken;
let nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
  byte &= 63;
  if (byte < 36) {
    id += byte.toString(36);
  } else if (byte < 62) {
    id += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id += "-";
  } else {
    id += "_";
  }
  return id;
}, "");
const LISTENER_CMDS = {
  API: "API",
  GET_CONTEXT: "GET_CONTEXT",
  RETURN: "RETURN",
  GET_FORM_FIELD: "GET_FORM_FIELD",
  UPDATE_FORM: "UPDATE_FORM",
  GET_TABLE: "GET_TABLE",
  GET_TABLE_ROW: "GET_TABLE_ROW",
  ADD_TABLE_ROW: "ADD_TABLE_ROW",
  ADD_TABLE_ROWS: "ADD_TABLE_ROWS",
  DELETE_TABLE_ROW: "DELETE_TABLE_ROW",
  TO_JSON: "TO_JSON",
  GET_TABLE_ROWS: "GET_TABLE_ROWS",
  GET_SELECTED_TABLE_ROWS: "GET_SELECTED_TABLE_ROWS",
  GET_FORM_VALIDATION_ERRORS: "GET_FORM_VALIDATION_ERRORS",
  GET_FORM_CONFIGURATION: "GET_FORM_CONFIGURATION",
  MESSAGE: "MESSAGE",
  CONFIRM: "CONFIRM",
  ALERT: "ALERT",
  REDIRECT: "REDIRECT",
  OPEN_PAGE: "OPEN_PAGE",
  FORMAT_DATE: "FORMAT_DATE",
  FORMAT_DATE_TIME: "FORMAT_DATE_TIME",
  FORMAT_NUMBER: "FORMAT_NUMBER",
  FORMAT_CURRENCY: "FORMAT_CURRENCY",
  FORMAT_BOOLEAN: "FORMAT_BOOLEAN",
  GET_APP_VARIABLE: "GET_APP_VARIABLE",
  SET_APP_VARIABLE: "SET_APP_VARIABLE",
  GET_PAGE_VARIABLE: "GET_PAGE_VARIABLE",
  SET_PAGE_VARIABLE: "SET_PAGE_VARIABLE",
  GET_PAGE_PARAMS: "GET_PAGE_PARAMS",
  GET_ALL_PAGE_PARAMS: "GET_ALL_PAGE_PARAMS",
  PAGE_ON_CLOSE: "PAGE_ON_CLOSE",
  OPEN_POPUP: "OPEN_POPUP",
  GET_POPUP_PARAMS: "GET_POPUP_PARAMS",
  GET_ALL_POPUP_PARAMS: "GET_ALL_POPUP_PARAMS",
  CLOSE_POPUP: "CLOSE_POPUP",
  COMPONENT_GET: "COMPONENT_GET",
  COMPONENT_REFRESH: "COMPONENT_REFRESH",
  COMPONENT_SHOW: "COMPONENT_SHOW",
  COMPONENT_HIDE: "COMPONENT_HIDE",
  COMPONENT_ADD_EVENT_LISTENER: "COMPONENT_ADD_EVENT_LISTENER",
  CC_INITIALIZE: "CC_INITIALIZE",
  CC_WATCH_PARAMS: "CC_WATCH_PARAMS",
  WINDOW_NDEF_READER_NEW: "WINDOW_NDEF_READER_NEW",
  WINDOW_NDEF_READER_SCAN: "WINDOW_NDEF_READER_SCAN",
  WINDOW_NDEF_READER_WRITE: "WINDOW_NDEF_READER_WRITE",
  WINDOW_NDEF_READER_ADD_EVENT_LISTENER: "WINDOW_NDEF_READER_ADD_EVENT_LISTENER",
  WINDOW_NDEF_READER_MAKE_READONLY: "WINDOW_NDEF_READER_MAKE_READONLY",
  WINDOW_NDEF_READER_ABORT_SCAN: "WINDOW_NDEF_READER_ABORT_SCAN",
  DECISION_TABLE_EXECUTE: "DECISION_TABLE_EXECUTE",
  DATAFORM_IMPORT_CSV: "DATAFORM_IMPORT_CSV",
  DATAFORM_OPEN_FORM: "DATAFORM_OPEN_FORM",
  DATAFORM_GET_ITEMS: "DATAFORM_GET_ITEMS",
  DATAFORM_CREATE_ITEM: "DATAFORM_CREATE_ITEM",
  DATAFORM_UPDATE_ITEM: "DATAFORM_UPDATE_ITEM",
  DATAFORM_INIT_FORM: "DATAFORM_INIT_FORM",
  DATAFORM_GET_FIELD_OPTIONS: "DATAFORM_GET_FIELD_OPTIONS",
  PROCESS_OPEN_FORM: "PROCESS_OPEN_FORM",
  PROCESS_GET_MY_ITEMS: "PROCESS_GET_MY_ITEMS",
  PROCESS_GET_MY_TASKS: "PROCESS_GET_MY_TASKS",
  PROCESS_GET_PARTICIPATED: "PROCESS_GET_PARTICIPATED",
  PROCESS_GET_ADMIN_ITEMS: "PROCESS_GET_ADMIN_ITEMS",
  PROCESS_CREATE_ITEM: "PROCESS_CREATE_ITEM",
  PROCESS_UPDATE_ITEM: "PROCESS_UPDATE_ITEM",
  PROCESS_DELETE_ITEM: "PROCESS_DELETE_ITEM",
  PROCESS_INIT_FORM: "PROCESS_INIT_FORM",
  PROCESS_GET_FIELD_OPTIONS: "PROCESS_GET_FIELD_OPTIONS",
  BOARD_IMPORT_CSV: "BOARD_IMPORT_CSV",
  BOARD_OPEN_FORM: "BOARD_OPEN_FORM",
  BOARD_GET_ITEMS: "BOARD_GET_ITEMS",
  BOARD_GET_ITEMS_COUNT: "BOARD_GET_ITEMS_COUNT",
  BOARD_CREATE_ITEM: "BOARD_CREATE_ITEM",
  BOARD_UPDATE_ITEM: "BOARD_UPDATE_ITEM",
  BOARD_DELETE_ITEM: "BOARD_DELETE_ITEM",
  BOARD_INIT_FORM: "BOARD_INIT_FORM",
  BOARD_GET_FIELD_OPTIONS: "BOARD_GET_FIELD_OPTIONS"
};
const EVENT_TYPES = {
  COMPONENT_ON_MOUNT: "componentOnMount",
  CC_ON_PARAMS_CHANGE: "onCustomComponentParamsChange"
};
const DEFAULTS = {
  POPUP_ID: "ACTIVE_POP_UP"
};
function generateId(prefix = "lcncsdk") {
  return `${prefix}-${nanoid()}`;
}
const globalInstances = {};
function processResponse(req, resp) {
  if (resp && Object.keys(resp).length === 1 && req.command !== LISTENER_CMDS.API) {
    let value = Object.values(resp)[0];
    if (value === "undefined")
      return void 0;
    return value;
  } else {
    return resp;
  }
}
function postMessage(args) {
  if (globalThis.parent && globalThis.parent !== globalThis) {
    globalThis.parent.postMessage(args, "*");
  } else {
    globalThis.postMessage(args);
  }
}
function onMessage(event) {
  if (event.origin !== globalThis.location.origin) {
    const data = event.data;
    if (data == null ? void 0 : data.isEvent) {
      const { target, eventParams, eventName, eventConfig = {} } = data;
      let targetInstance = globalInstances[target];
      targetInstance._dispatchEvent(eventName, eventParams);
      if (eventConfig.once) {
        targetInstance._removeEventListener(eventName);
      }
      return;
    }
    let { _req: req, resp } = data;
    if (req == null ? void 0 : req._id) {
      let targetInstance = globalInstances[req._id];
      targetInstance._dispatchMessageEvents(req, resp);
    }
  }
}
globalThis.addEventListener("message", onMessage);
class EventBase {
  constructor() {
    __privateAdd(this, _listeners, void 0);
    __privateSet(this, _listeners, {});
  }
  _addEventListener(eventName, callBack) {
    var _a;
    __privateGet(this, _listeners)[eventName] = ((_a = __privateGet(this, _listeners)) == null ? void 0 : _a[eventName]) || [];
    __privateGet(this, _listeners)[eventName].push(callBack);
  }
  _removeEventListener(eventName, callBack) {
    if (callBack) {
      let index = __privateGet(this, _listeners)[eventName].findIndex(callBack);
      index > -1 && __privateGet(this, _listeners)[eventName].splice(index, 1);
      return;
    }
    Reflect.deleteProperty(__privateGet(this, _listeners), eventName);
  }
  _dispatchEvent(eventName, eventParams) {
    if (Array.isArray(__privateGet(this, _listeners)[eventName])) {
      __privateGet(this, _listeners)[eventName].forEach(
        (callBack) => callBack(eventParams)
      );
      return true;
    }
    return false;
  }
  _dispatchMessageEvents(req, resp) {
    let target = req._id;
    if (Array.isArray(__privateGet(this, _listeners)[target])) {
      __privateGet(this, _listeners)[target].forEach((listener) => {
        try {
          let processedResp = processResponse(req, resp);
          listener(processedResp);
        } catch (err) {
          console.error("Message callback error: ", err);
        }
      });
      this._removeEventListener(target);
    }
  }
}
_listeners = new WeakMap();
class BaseSDK extends EventBase {
  _postMessageAsync(command, args, hasCallBack, callBack) {
    return new Promise((resolve, reject) => {
      const _id = generateId(command.toLowerCase());
      postMessage({ _id, command, ...args });
      globalInstances[_id] = this;
      this._addEventListener(_id, async (data) => {
        if ((data == null ? void 0 : data.errorMessage) || (data == null ? void 0 : data.isError)) {
          reject(data);
        } else {
          if (hasCallBack && callBack) {
            data = await callBack(data);
          }
          resolve(data);
        }
      });
    });
  }
  _postMessage(command, args, callBack) {
    const _id = generateId(command.toLowerCase());
    postMessage({ _id, command, ...args });
    if (callBack) {
      this._addEventListener(args.eventName, callBack);
    }
  }
  _postMessageSync(command, args) {
    let intialValue = 0;
    const _id = generateId(command.toLowerCase());
    let data = { _id, command, ...args };
    let atomics = new AtomicsHandler();
    atomics.reset();
    atomics.store(0, intialValue);
    atomics.encodeData(1, data);
    postMessage(atomics.sab);
    atomics.wait(0, intialValue, 1e4);
    let decodedData = atomics.decodeData();
    let { _req: req, resp } = decodedData;
    let processedResp = processResponse(req, resp);
    if (processedResp == null ? void 0 : processedResp.isError) {
      throw new Error(`Error: ${JSON.stringify(processedResp, null, 2)}`);
    }
    return processedResp;
  }
}
let sharedArrayBufferInstance;
class AtomicsHandler {
  constructor() {
    __privateAdd(this, _textEncoder, void 0);
    __privateAdd(this, _textDecoder, void 0);
    __privateSet(this, _textEncoder, new TextEncoder());
    __privateSet(this, _textDecoder, new TextDecoder());
    sharedArrayBufferInstance = sharedArrayBufferInstance || new SharedArrayBuffer(1024 * 1024);
    this.sab = sharedArrayBufferInstance;
    this.int32Array = new Int32Array(this.sab);
  }
  load(index = 0) {
    return Atomics.load(this.int32Array, index);
  }
  store(index = 0, data) {
    return Atomics.store(this.int32Array, index, data);
  }
  reset() {
    return this.int32Array.fill(0);
  }
  notify(index = 0, count = 1) {
    return Atomics.notify(this.int32Array, index, count);
  }
  wait(index, value, timeout) {
    return Atomics.wait(this.int32Array, index, value, timeout);
  }
  encodeData(index = 0, data) {
    const replacer = (key, value) => value === void 0 ? "undefined" : value;
    let string = JSON.stringify(data, replacer);
    let encodedData = __privateGet(this, _textEncoder).encode(string);
    this.int32Array.set(encodedData, index);
    return this.int32Array;
  }
  decodeData() {
    let uInt8Array = new Uint8Array(this.int32Array);
    let string = __privateGet(this, _textDecoder).decode(uInt8Array).replaceAll(/\x00/g, "");
    return JSON.parse(string);
  }
}
_textEncoder = new WeakMap();
_textDecoder = new WeakMap();
class Form extends BaseSDK {
  constructor(instanceId, flowId) {
    super();
    this.type = "Form";
    this.instanceId = instanceId;
    this.flowId = flowId;
  }
  toJSON() {
    return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
      instanceId: this.instanceId
    });
  }
  getField(fieldId) {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
      instanceId: this.instanceId,
      fieldId
    });
  }
  updateField(args) {
    return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
      flowId: this.flowId,
      instanceId: this.instanceId,
      data: args
    });
  }
  getValidationErrors() {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_VALIDATION_ERRORS, {
      instanceId: this.instanceId
    });
  }
  getFormConfiguration() {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_CONFIGURATION, {
      instanceId: this.instanceId
    });
  }
  getTable(tableId) {
    return new Table(this.instanceId, tableId);
  }
}
class Table extends BaseSDK {
  constructor(instanceId, tableId) {
    super();
    this.tableId = tableId;
    this.instanceId = instanceId;
  }
  toJSON() {
    return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
      tableId: this.tableId
    });
  }
  getSelectedRows() {
    return this._postMessageAsync(LISTENER_CMDS.GET_SELECTED_TABLE_ROWS, {
      tableId: this.tableId
    });
  }
  getRows() {
    return this._postMessageAsync(
      LISTENER_CMDS.GET_TABLE_ROWS,
      { tableId: this.tableId },
      true,
      (data) => {
        return data.map(
          (row) => new TableForm(this.instanceId, this.tableId, row.id)
        );
      }
    );
  }
  getRow(rowId) {
    return new TableForm(this.instanceId, this.tableId, rowId);
  }
  addRow(rowObject) {
    return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROW, {
      tableId: this.tableId,
      rowObject
    });
  }
  addRows(rows) {
    return this._postMessageAsync(LISTENER_CMDS.ADD_TABLE_ROWS, {
      tableId: this.tableId,
      rows
    });
  }
  deleteRow(rowId) {
    return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
      tableId: this.tableId,
      rows: [rowId]
    });
  }
  deleteRows(rows) {
    return this._postMessageAsync(LISTENER_CMDS.DELETE_TABLE_ROW, {
      tableId: this.tableId,
      rows
    });
  }
}
class TableForm extends BaseSDK {
  constructor(instanceId, tableId, rowId) {
    super();
    this.instanceId = instanceId;
    this.type = "TabelForm";
    this.tableId = tableId;
    this.rowId = rowId;
  }
  getParent() {
    return new Form(this.instanceId);
  }
  toJSON() {
    return this._postMessageAsync(LISTENER_CMDS.TO_JSON, {
      tableId: this.tableId,
      rowId: this.rowId
    });
  }
  getField(fieldId) {
    return this._postMessageAsync(LISTENER_CMDS.GET_FORM_FIELD, {
      instanceId: this.instanceId,
      tableId: this.tableId,
      rowId: this.rowId,
      fieldId
    });
  }
  updateField(args) {
    return this._postMessageAsync(LISTENER_CMDS.UPDATE_FORM, {
      instanceId: this.instanceId,
      tableId: this.tableId,
      rowId: this.rowId,
      data: args
    });
  }
}
class Client extends BaseSDK {
  showInfo(message) {
    return super._postMessageAsync(LISTENER_CMDS.MESSAGE, { message });
  }
  showConfirm(args) {
    return super._postMessageAsync(LISTENER_CMDS.CONFIRM, {
      data: {
        title: args.title,
        content: args.content,
        okText: args.okText || "Ok",
        cancelText: args.cancelText || "Cancel"
      }
    });
  }
  redirect(url) {
    return super._postMessageAsync(LISTENER_CMDS.REDIRECT, { url });
  }
}
class Formatter extends BaseSDK {
  toDate(date) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE, {
      date
    });
  }
  toDateTime(date) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_DATE_TIME, {
      date
    });
  }
  toNumber(value) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_NUMBER, {
      value
    });
  }
  toCurrency(value, currencyCode) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_CURRENCY, {
      value,
      currencyCode
    });
  }
  toBoolean(value) {
    return this._postMessageAsync(LISTENER_CMDS.FORMAT_BOOLEAN, {
      value
    });
  }
}
function requireFieldAsync(value, fieldName) {
  if (!value) {
    return Promise.reject({ message: `${fieldName} is required` });
  }
  return null;
}
function requireFieldsAsync(fields) {
  const missingFields = fields.filter((f) => !f.value).map((f) => f.name);
  if (missingFields.length > 0) {
    return Promise.reject({
      message: `${missingFields.join(" and ")} ${missingFields.length > 1 ? "are" : "is"} required`
    });
  }
  return null;
}
class Component extends BaseSDK {
  constructor(props) {
    super();
    __privateAdd(this, _registerComponentAPIs);
    this._id = props.componentId;
    this.type = "Component";
    globalInstances[this._id] = this;
    __privateMethod(this, _registerComponentAPIs, registerComponentAPIs_fn).call(this, props.componentMethods);
  }
  onMount(callback) {
    this._postMessage(
      LISTENER_CMDS.COMPONENT_ADD_EVENT_LISTENER,
      {
        id: this._id,
        eventName: EVENT_TYPES.COMPONENT_ON_MOUNT,
        eventConfig: {
          once: true
        }
      },
      callback
    );
  }
  refresh() {
    return this._postMessageAsync(LISTENER_CMDS.COMPONENT_REFRESH, {
      id: this._id
    });
  }
  show() {
    return this._postMessageAsync(LISTENER_CMDS.COMPONENT_SHOW, {
      id: this._id
    });
  }
  hide() {
    return this._postMessageAsync(LISTENER_CMDS.COMPONENT_HIDE, {
      id: this._id
    });
  }
}
_registerComponentAPIs = new WeakSet();
registerComponentAPIs_fn = function(componentAPIs) {
  componentAPIs == null ? void 0 : componentAPIs.forEach((Api) => {
    this[Api.name] = (...args) => {
      if (Api.type === "method") {
        return this._postMessageAsync(`COMPONENT_${Api.name}`, {
          id: this._id,
          parameters: args
        });
      } else if (Api.type === "event") {
        this._postMessage(
          LISTENER_CMDS.COMPONENT_ADD_EVENT_LISTENER,
          {
            id: this._id,
            eventName: Api.name,
            eventConfig: args[1]
          },
          args[0]
        );
      }
    };
  });
};
class Popup extends BaseSDK {
  constructor(props) {
    super();
    this.type = "Popup";
    this._id = props.popupId || DEFAULTS.POPUP_ID;
  }
  getParameter(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_POPUP_PARAMS, {
      key,
      popupId: this._id
    });
  }
  getAllParameters() {
    return this._postMessageAsync(LISTENER_CMDS.GET_ALL_POPUP_PARAMS, {
      popupId: this._id
    });
  }
  close() {
    return this._postMessageAsync(LISTENER_CMDS.CLOSE_POPUP, {});
  }
  getComponent(componentId) {
    return this._postMessageAsync(
      LISTENER_CMDS.COMPONENT_GET,
      { componentId },
      true,
      (data) => {
        return new Component(data);
      }
    );
  }
}
class Page extends BaseSDK {
  constructor(props, isCustomComponent = false) {
    super();
    this.type = "Page";
    this.popup = new Popup({});
    this._id = props.pageId;
  }
  getParameter(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_PARAMS, {
      key
    });
  }
  getAllParameters() {
    return this._postMessageAsync(LISTENER_CMDS.GET_ALL_PAGE_PARAMS, {
      pageId: this._id
    });
  }
  getVariable(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_VARIABLE, {
      key
    });
  }
  setVariable(key, value) {
    return this._postMessageAsync(LISTENER_CMDS.SET_PAGE_VARIABLE, {
      key,
      value
    });
  }
  openPopup(popupId, popupParams) {
    return this._postMessageAsync(LISTENER_CMDS.OPEN_POPUP, {
      popupId,
      popupParams
    });
  }
  getComponent(componentId) {
    return this._postMessageAsync(
      LISTENER_CMDS.COMPONENT_GET,
      { componentId },
      true,
      (data) => new Component(data)
    );
  }
}
class DecisionTable extends BaseSDK {
  constructor(flowId) {
    super();
    this.flowId = flowId;
  }
  evaluate(payload) {
    return this._postMessageAsync(LISTENER_CMDS.DECISION_TABLE_EXECUTE, {
      flowId: this.flowId,
      payload
    });
  }
}
class Dataform extends BaseSDK {
  constructor(flowId) {
    super();
    this._id = flowId;
  }
  getItems(options) {
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_ITEMS, {
      flowId: this._id,
      searchValue: (options == null ? void 0 : options.searchValue) || "",
      pageNumber: (options == null ? void 0 : options.pageNumber) || 1,
      pageSize: (options == null ? void 0 : options.pageSize) || 50,
      filters: (options == null ? void 0 : options.filters) || {},
      sortBy: (options == null ? void 0 : options.sortBy) || []
    });
  }
  createItem(options) {
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_CREATE_ITEM, {
      flowId: this._id,
      data: (options == null ? void 0 : options.data) || {},
      viewId: (options == null ? void 0 : options.viewId) || ""
    });
  }
  updateItem(options) {
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_UPDATE_ITEM, {
      flowId: this._id,
      itemId: options.itemId,
      data: options.data,
      viewId: options.viewId || ""
    });
  }
  importCSV(defaultValues) {
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_IMPORT_CSV, {
      flowId: this._id,
      defaultValues
    });
  }
  openForm(item) {
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
  getForm(instanceId) {
    return new Form(instanceId, this._id);
  }
  initForm(instanceId) {
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_INIT_FORM, {
      flowId: this._id,
      instanceId: instanceId || ""
    }).then((response) => {
      return new Form(response.storeId || instanceId || "", this._id);
    });
  }
  getFieldOptions(options) {
    return this._postMessageAsync(LISTENER_CMDS.DATAFORM_GET_FIELD_OPTIONS, {
      flowId: this._id,
      instanceId: (options == null ? void 0 : options.instanceId) || "",
      fieldId: (options == null ? void 0 : options.fieldId) || ""
    });
  }
}
class Board extends BaseSDK {
  constructor(flowId) {
    super();
    this._id = flowId;
  }
  importCSV(defaultValues) {
    return this._postMessageAsync(LISTENER_CMDS.BOARD_IMPORT_CSV, {
      flowId: this._id,
      defaultValues
    });
  }
  openForm(item) {
    const error = requireFieldAsync(item._id, "Instance Id (_id)");
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.BOARD_OPEN_FORM, {
      flowId: this._id,
      itemId: item._id,
      viewId: item._view_id
    });
  }
  getItems(options) {
    const error = requireFieldAsync(options.viewId, "viewId");
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.BOARD_GET_ITEMS, {
      flowId: this._id,
      viewId: options.viewId,
      searchValue: options.searchValue || "",
      pageNumber: options.pageNumber || 1,
      pageSize: options.pageSize || 50,
      filters: options.filters || {},
      sortBy: options.sortBy || [],
      payload: options.payload || {}
    });
  }
  getItemsCount(options) {
    const error = requireFieldAsync(options.viewId, "viewId");
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.BOARD_GET_ITEMS_COUNT, {
      flowId: this._id,
      viewId: options.viewId,
      payload: options.payload || {}
    });
  }
  createItem(options) {
    return this._postMessageAsync(LISTENER_CMDS.BOARD_CREATE_ITEM, {
      flowId: this._id,
      data: (options == null ? void 0 : options.data) || {}
    });
  }
  updateItem(options) {
    const error = requireFieldAsync(options.instanceId, "instanceId");
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.BOARD_UPDATE_ITEM, {
      flowId: this._id,
      instanceId: options.instanceId,
      data: options.data
    });
  }
  deleteItem(options) {
    const error = requireFieldAsync(options.instanceId, "instanceId");
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.BOARD_DELETE_ITEM, {
      flowId: this._id,
      instanceId: options.instanceId
    });
  }
  initForm(instanceId) {
    return this._postMessageAsync(LISTENER_CMDS.BOARD_INIT_FORM, {
      flowId: this._id,
      instanceId: instanceId || ""
    }).then((response) => {
      return new Form(response.storeId || instanceId || "", this._id);
    });
  }
  getFieldOptions(options) {
    const error = requireFieldsAsync([
      { value: options.instanceId, name: "instanceId" },
      { value: options.fieldId, name: "fieldId" }
    ]);
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.BOARD_GET_FIELD_OPTIONS, {
      flowId: this._id,
      instanceId: options.instanceId,
      fieldId: options.fieldId
    });
  }
}
class Process extends BaseSDK {
  constructor(flowId) {
    super();
    this._id = flowId;
  }
  getMyItems(options) {
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_MY_ITEMS, {
      flowId: this._id,
      status: (options == null ? void 0 : options.status) || "draft",
      searchValue: (options == null ? void 0 : options.searchValue) || "",
      pageNumber: (options == null ? void 0 : options.pageNumber) || 1,
      pageSize: (options == null ? void 0 : options.pageSize) || 50,
      filters: (options == null ? void 0 : options.filters) || {},
      sortBy: (options == null ? void 0 : options.sortBy) || []
    });
  }
  getMyTasks(options) {
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_MY_TASKS, {
      flowId: this._id,
      activityId: (options == null ? void 0 : options.activityId) || "",
      searchValue: (options == null ? void 0 : options.searchValue) || "",
      pageNumber: (options == null ? void 0 : options.pageNumber) || 1,
      pageSize: (options == null ? void 0 : options.pageSize) || 50,
      filters: (options == null ? void 0 : options.filters) || {},
      sortBy: (options == null ? void 0 : options.sortBy) || []
    });
  }
  getParticipated(options) {
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_PARTICIPATED, {
      flowId: this._id,
      activityId: (options == null ? void 0 : options.activityId) || "",
      searchValue: (options == null ? void 0 : options.searchValue) || "",
      pageNumber: (options == null ? void 0 : options.pageNumber) || 1,
      pageSize: (options == null ? void 0 : options.pageSize) || 50,
      filters: (options == null ? void 0 : options.filters) || {},
      sortBy: (options == null ? void 0 : options.sortBy) || []
    });
  }
  getAdminItems(options) {
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_ADMIN_ITEMS, {
      flowId: this._id,
      searchValue: (options == null ? void 0 : options.searchValue) || "",
      pageNumber: (options == null ? void 0 : options.pageNumber) || 1,
      pageSize: (options == null ? void 0 : options.pageSize) || 50,
      filters: (options == null ? void 0 : options.filters) || {},
      sortBy: (options == null ? void 0 : options.sortBy) || []
    });
  }
  createItem(options) {
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_CREATE_ITEM, {
      flowId: this._id,
      data: (options == null ? void 0 : options.data) || {}
    });
  }
  updateItem(options) {
    const error = requireFieldsAsync([
      { value: options.instanceId, name: "instanceId" },
      { value: options.activityInstanceId, name: "activityInstanceId" }
    ]);
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_UPDATE_ITEM, {
      flowId: this._id,
      instanceId: options.instanceId,
      activityInstanceId: options.activityInstanceId,
      data: options.data
    });
  }
  deleteItem(options) {
    const error = requireFieldAsync(options.instanceId, "instanceId");
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_DELETE_ITEM, {
      flowId: this._id,
      instanceId: options.instanceId
    });
  }
  initForm(instanceId, activityInstanceId) {
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_INIT_FORM, {
      flowId: this._id,
      instanceId: instanceId || "",
      activityInstanceId: activityInstanceId || ""
    }).then((response) => {
      return new Form(response.storeId || instanceId || "", this._id);
    });
  }
  getFieldOptions(options) {
    const error = requireFieldsAsync([
      { value: options.instanceId, name: "instanceId" },
      { value: options.fieldId, name: "fieldId" }
    ]);
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_GET_FIELD_OPTIONS, {
      flowId: this._id,
      instanceId: options.instanceId,
      activityInstanceId: options.activityInstanceId || "",
      fieldId: options.fieldId
    });
  }
  openForm(item) {
    const error = requireFieldsAsync([
      { value: item._id, name: "Instance Id (_id)" },
      { value: item._activity_instance_id, name: "Activity Instance Id (_activity_instance_id)" }
    ]);
    if (error)
      return error;
    return this._postMessageAsync(LISTENER_CMDS.PROCESS_OPEN_FORM, {
      flowId: this._id,
      instanceId: item._id,
      activityInstanceId: item._activity_instance_id
    });
  }
}
class Application extends BaseSDK {
  constructor(props, isCustomComponent = false) {
    super();
    this._id = props.appId;
    this.page = new Page(props);
  }
  getVariable(key) {
    return this._postMessageAsync(LISTENER_CMDS.GET_APP_VARIABLE, {
      key
    });
  }
  setVariable(key, value) {
    return this._postMessageAsync(LISTENER_CMDS.SET_APP_VARIABLE, {
      key,
      value
    });
  }
  openPage(pageId, pageParams) {
    return this._postMessageAsync(LISTENER_CMDS.OPEN_PAGE, {
      pageId,
      pageParams
    });
  }
  getDecisionTable(flowId) {
    return new DecisionTable(flowId);
  }
  getDataform(flowId) {
    return new Dataform(flowId);
  }
  getBoard(flowId) {
    return new Board(flowId);
  }
  getProcess(flowId) {
    return new Process(flowId);
  }
}
class NDEFReader extends BaseSDK {
  constructor() {
    super();
    this.id = generateId(LISTENER_CMDS.WINDOW_NDEF_READER_NEW);
    globalInstances[this.id] = this;
    this._postMessage(
      LISTENER_CMDS.WINDOW_NDEF_READER_NEW,
      {
        id: this.id,
        operation: "new"
      },
      (data) => {
      }
    );
  }
  scan() {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_SCAN,
        { id: this.id, operation: "scan" },
        ({ data, err }) => {
          console.log("scan data from main window ", data);
          resolve(data);
        }
      );
    });
  }
  write(data) {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_WRITE,
        { id: this.id, operation: "write", data },
        ({ data: data2, err }) => {
        }
      );
    });
  }
  addEventListener(eventName, cb) {
    this._postMessage(
      LISTENER_CMDS.WINDOW_NDEF_READER_ADD_EVENT_LISTENER,
      {
        id: this.id,
        operation: "addEventListener",
        eventName
      },
      () => {
      }
    );
  }
  makeReadOnly() {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_MAKE_READONLY,
        { id: this.id, operation: "makeReadOnly" },
        ({ data, err }) => {
        }
      );
    });
  }
  abortScan() {
    return new Promise((resolve, reject) => {
      this._postMessage(
        LISTENER_CMDS.WINDOW_NDEF_READER_ABORT_SCAN,
        { id: this.id, operation: "abortScan" },
        ({ data, err }) => {
        }
      );
    });
  }
}
const window = {
  NDEFReader
};
class LowcodeSDK extends BaseSDK {
  constructor(props) {
    super();
    __privateAdd(this, _csrfToken, void 0);
    if (props.tableId && props.tableRowId) {
      this.context = new TableForm(
        props.formInstanceId,
        props.tableId,
        props.tableRowId
      );
    } else if (props.formInstanceId) {
      this.context = new Form(props.formInstanceId);
    } else if (props.popupId) {
      this.context = new Popup(props);
    } else if (props.pageId && !props.componentId) {
      this.context = new Page(props);
    } else if (props.componentId) {
      this.context = new Component(props);
    }
    this.client = new Client();
    this.formatter = new Formatter();
    if (props.appId) {
      this.app = new Application(props);
    }
    this.user = props.user;
    this.env = props.envDetails;
    this.account = props.account;
    __privateSet(this, _csrfToken, props.csrfToken);
  }
  async api(url, args) {
    const response = await globalThis.fetch(url, {
      ...args,
      headers: {
        ...(args == null ? void 0 : args.headers) || {},
        "X-Csrf-Token": __privateGet(this, _csrfToken)
      }
    });
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return response;
    }
  }
}
_csrfToken = new WeakMap();
function initSDK(config) {
  return new LowcodeSDK(config);
}
export { initSDK as default, window };
