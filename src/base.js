var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _BaseSDK_instances, _BaseSDK_listeners, _BaseSDK_addListener, _BaseSDK_onMessage;
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
export class BaseSDK {
    constructor(props) {
        _BaseSDK_instances.add(this);
        _BaseSDK_listeners.set(this, void 0);
        console.log("SDK : Initializing ", props);
        __classPrivateFieldSet(this, _BaseSDK_listeners, {}, "f");
        self.addEventListener("message", __classPrivateFieldGet(this, _BaseSDK_instances, "m", _BaseSDK_onMessage).bind(this), false);
    }
    _postMessageAsync(command, args, hasCallBack, callBack) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            const _id = generateId((_b = (_a = Object.keys(__classPrivateFieldGet(this, _BaseSDK_listeners, "f"))) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 100);
            postMessage(Object.assign({ _id, command }, args));
            __classPrivateFieldGet(this, _BaseSDK_instances, "m", _BaseSDK_addListener).call(this, _id, (data) => __awaiter(this, void 0, void 0, function* () {
                if (data.errorMessage) {
                    reject(data);
                }
                else {
                    if (hasCallBack && callBack) {
                        data = yield callBack(data);
                    }
                    resolve(data);
                }
            }));
        });
    }
    _postMessage(command, func, args = {}) {
        var _a, _b;
        const _id = generateId((_b = (_a = Object.keys(__classPrivateFieldGet(this, _BaseSDK_listeners, "f"))) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 100);
        postMessage(Object.assign({ _id, command }, args));
        __classPrivateFieldGet(this, _BaseSDK_instances, "m", _BaseSDK_addListener).call(this, _id, (data) => func(data));
    }
}
_BaseSDK_listeners = new WeakMap(), _BaseSDK_instances = new WeakSet(), _BaseSDK_addListener = function _BaseSDK_addListener(_id, callback) {
    __classPrivateFieldGet(this, _BaseSDK_listeners, "f")[_id] = __classPrivateFieldGet(this, _BaseSDK_listeners, "f")[_id] || [];
    __classPrivateFieldGet(this, _BaseSDK_listeners, "f")[_id].push(callback);
}, _BaseSDK_onMessage = function _BaseSDK_onMessage(event) {
    if (event.origin !== self.location.origin) {
        console.log("SDK : @onMessage ", event);
        const data = event.data;
        const _req = (data === null || data === void 0 ? void 0 : data._req) || {};
        let listeners = __classPrivateFieldGet(this, _BaseSDK_listeners, "f")[_req === null || _req === void 0 ? void 0 : _req._id] || [];
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
