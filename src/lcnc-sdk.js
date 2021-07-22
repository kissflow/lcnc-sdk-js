function generateId() {
    return Math.floor(Date.now()).toString(36);
}

function postMessage(args) {
    console.log("SDK : @postMessage ", args);
    if (self.parent && self.parent !== self) {
        self.parent.postMessage(args, "*");
    } else {
        self.postMessage(args);
    }
}

class LcncSdk {
    constructor(props) {
        console.log("SDK : Initializing ", props);
        this._listeners = {};
        this._onMessage = this._onMessage.bind(this);
        self.addEventListener("message", this._onMessage, false);
    }

    api(url, args = {}) {
        return this._fetch("API", { url, args });
    }

    watchParams(args = {}) {
        return this._fetch("PARAMS", args);
    }

    showInfo(message) {
        return this._fetch("MESSAGE", { message });
    }

    updateForm(args) {
        return this._fetch("UPDATEFORM", { data: args });
    }

    showConfirm({
        title,
        content,
        okText = "Ok",
        cancelText = "Cancel"
    }) {
        return this._fetch("CONFIRM", {
            data: {
                title,
                content,
                okText,
                cancelText
            }
        });
    }

    redirect(url, shouldConfirm) {
        return this._fetch("REDIRECT", { url })
    }

    _addListener(_id, callback) {
        this._listeners[_id] = this._listeners[_id] || [];
        this._listeners[_id].push(callback);
    }

    _fetch(command, args) {
        return new Promise((resolve, reject) => {
            const _id = generateId();
            postMessage({ _id, command, ...args });
            this._addListener(_id, (data) => {
                if (data.errorMessage) {
                    reject(data);
                } else {
                    resolve(data);
                }
            });
        });
    }

    _onMessage(event) {
        console.log("SDK : @onMessage", event.origin, "!==", self.location.origin);
        if (event.origin !== self.location.origin) {
            console.log("SDK : @onMessage ", event);
            const data = event.data;
            const _req = data._req || {};
            let listeners = this._listeners[_req._id] || [];
            if (listeners) {
                listeners.forEach((listener) => {
                    try {
                        listener(data);
                    } catch (err) {
                        console.error("Message callback error: ", err);
                    }
                });
            }
        }
    }
}

class ProcessSdk extends LcncSdk {
}

function initSDK(config = {}) {
    if (config.flow === "Process") {
        return new ProcessSdk(config);
    }
    return new LcncSdk(config);
}

export default initSDK;