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
var _LcncSdk_instances, _LcncSdk_listeners, _LcncSdk_addListener, _LcncSdk_postMessageUtil, _LcncSdk_onMessage;
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
class LcncSdk {
    constructor(props) {
        _LcncSdk_instances.add(this);
        _LcncSdk_listeners.set(this, void 0);
        console.log("SDK : Initializing ", props);
        __classPrivateFieldSet(this, _LcncSdk_listeners, {}, "f");
        self.addEventListener("message", __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_onMessage).bind(this), false);
    }
    api(url, args = {}) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.API, { url, args });
    }
    watchParams(args = {}) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.PARAMS, args);
    }
    getAccountContext(args = {}) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.ACCOUNTCONTEXT, args);
    }
    showInfo(message) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.MESSAGE, { message });
    }
    getFormField(fieldId) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.GETFORMFIELD, { fieldId });
    }
    getFormTableField(tableId, rowIndex, fieldId) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.GETFORMTABLEFIELD, {
            tableId,
            rowIndex,
            fieldId
        });
    }
    updateForm(args = {}) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.UPDATEFORM, { data: args });
    }
    updateFormTable(args = {}) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.UPDATEFORMTABLE, {
            data: args
        });
    }
    showConfirm(args) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.CONFIRM, {
            data: {
                title: args.title,
                content: args.content,
                okText: args.okText || "Ok",
                cancelText: args.cancelText || "Cancel"
            }
        });
    }
    redirect(url, shouldConfirm) {
        return __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_postMessageUtil).call(this, LISTENER_CMDS.REDIRECT, { url });
    }
}
_LcncSdk_listeners = new WeakMap(), _LcncSdk_instances = new WeakSet(), _LcncSdk_addListener = function _LcncSdk_addListener(_id, callback) {
    __classPrivateFieldGet(this, _LcncSdk_listeners, "f")[_id] = __classPrivateFieldGet(this, _LcncSdk_listeners, "f")[_id] || [];
    __classPrivateFieldGet(this, _LcncSdk_listeners, "f")[_id].push(callback);
}, _LcncSdk_postMessageUtil = function _LcncSdk_postMessageUtil(command, args) {
    return new Promise((resolve, reject) => {
        var _a, _b;
        const _id = generateId((_b = (_a = Object.keys(__classPrivateFieldGet(this, _LcncSdk_listeners, "f"))) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 100);
        postMessage(Object.assign({ _id, command }, args));
        __classPrivateFieldGet(this, _LcncSdk_instances, "m", _LcncSdk_addListener).call(this, _id, (data) => {
            if (data.errorMessage) {
                reject(data);
            }
            else {
                resolve(data);
            }
        });
    });
}, _LcncSdk_onMessage = function _LcncSdk_onMessage(event) {
    console.log("SDK : @onMessage", event.origin, "!==", self.location.origin);
    if (event.origin !== self.location.origin) {
        console.log("SDK : @onMessage ", event);
        const data = event.data;
        const _req = data._req || {};
        let listeners = __classPrivateFieldGet(this, _LcncSdk_listeners, "f")[_req._id] || [];
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
class ProcessSdk extends LcncSdk {
}
function initSDK(config = {}) {
    if (config.flow === "Process") {
        return new ProcessSdk(config);
    }
    return new LcncSdk(config);
}
export default initSDK;
