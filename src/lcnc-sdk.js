var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LcncSDK_instances, _LcncSDK_listeners, _LcncSDK_addListener, _LcncSDK_postMessageUtil, _LcncSDK_onMessage;
import { LISTENER_CMDS } from "./constants.js";
function generateId(len) {
    return Math.floor(Date.now() + len).toString(36);
}
function postMessage(args) {
    console.log("SDK : @postMessage ", args);
    if (self.parent && self.parent !== self) {
        self.parent.postMessage(args, "*");
    }
    else {
        self.postMessage(args);
    }
}
class LcncSDK {
    constructor(props) {
        _LcncSDK_instances.add(this);
        _LcncSDK_listeners.set(this, void 0);
        this.form = {
            getField: (fieldId) => {
                return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.GETFORMFIELD, {
                    fieldId
                });
            },
            getTableField: (tableId, rowIndex, fieldId) => {
                return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.GETFORMTABLEFIELD, {
                    tableId,
                    rowIndex,
                    fieldId
                });
            },
            updateField: (args = {}) => {
                return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.UPDATEFORM, {
                    data: args
                });
            },
            updateTableField: (args = {}) => {
                return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.UPDATEFORMTABLE, {
                    data: args
                });
            }
        };
        this.client = {
            showInfo: (message) => {
                return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.MESSAGE, { message });
            },
            showConfirm: (args) => {
                return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.CONFIRM, {
                    data: {
                        title: args.title,
                        content: args.content,
                        okText: args.okText || "Ok",
                        cancelText: args.cancelText || "Cancel"
                    }
                });
            }
        };
        console.log("SDK : Initializing ", props);
        __classPrivateFieldSet(this, _LcncSDK_listeners, {}, "f");
        self.addEventListener("message", __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_onMessage).bind(this), false);
    }
    api(url, args = {}) {
        return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.API, { url, args });
    }
    watchParams(args = {}) {
        return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.PARAMS, args);
    }
    getAccountContext() {
        return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.ACCOUNT_CONTEXT, {});
    }
    redirect(url, shouldConfirm) {
        return __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_postMessageUtil).call(this, LISTENER_CMDS.REDIRECT, { url });
    }
}
_LcncSDK_listeners = new WeakMap(), _LcncSDK_instances = new WeakSet(), _LcncSDK_addListener = function _LcncSDK_addListener(_id, callback) {
    __classPrivateFieldGet(this, _LcncSDK_listeners, "f")[_id] = __classPrivateFieldGet(this, _LcncSDK_listeners, "f")[_id] || [];
    __classPrivateFieldGet(this, _LcncSDK_listeners, "f")[_id].push(callback);
}, _LcncSDK_postMessageUtil = function _LcncSDK_postMessageUtil(command, args) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        const _id = generateId((_b = (_a = Object.keys(__classPrivateFieldGet(this, _LcncSDK_listeners, "f"))) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 100);
        postMessage(Object.assign({ _id, command }, args));
        __classPrivateFieldGet(this, _LcncSDK_instances, "m", _LcncSDK_addListener).call(this, _id, (data) => {
            if (data.errorMessage) {
                reject(data);
            }
            else {
                resolve(data);
            }
        });
    });
}, _LcncSDK_onMessage = function _LcncSDK_onMessage(event) {
    if (event.origin !== self.location.origin) {
        console.log("SDK : @onMessage ", event);
        const data = event.data;
        const _req = data._req || {};
        let listeners = __classPrivateFieldGet(this, _LcncSDK_listeners, "f")[_req._id] || [];
        if (listeners) {
            listeners.forEach((listener) => {
                try {
                    listener(data);
                }
                catch (err) {
                    console.error("Message callback error: ", err);
                }
            });
        }
    }
};
function initSDK(config = {}) {
    return new LcncSDK(config);
}
export default initSDK;
