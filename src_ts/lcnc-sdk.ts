function generateId() {
    return Math.floor(Date.now()).toString(36);
}

function postMessage(args:any) {
    console.log("SDK : @postMessage ", args);
    if (self.parent && self.parent !== self) {
        self.parent.postMessage(args, "*");
    } else {
        self.postMessage(args);
    }
}

class LcncSdk {
  #listeners: any;
  onMessage: (event: any) => void;
    constructor(props:any) {
        console.log("SDK : Initializing ", props);
        this.#listeners = {};
        this.onMessage = this.#onMessage.bind(this);
        self.addEventListener("message", this.#onMessage, false);
    }

    api(url:string, args = {}) {
        return this.#fetch("API", { url, args });
    }

    watchParams(args = {}) {
        return this.#fetch("PARAMS", args);
    }

    showInfo(message: string) {
        return this.#fetch("MESSAGE", { message });
    }

    updateForm(args={}) {
        return this.#fetch("UPDATEFORM", { data: args });
    }

    showConfirm(args: {
        title: string,
        content: string,
        okText:string,
        cancelText:string
    }) {
        return this.#fetch("CONFIRM", {
            data: {
                title: args.title,
                content: args.content,
                okText: args.okText || "Ok",
                cancelText: args.cancelText || "Cancel"
            }
        });
    }

    redirect(url:string, shouldConfirm:any) {
        return this.#fetch("REDIRECT", { url })
    }

    #addListener(_id:string, callback:any) {
        this.#listeners[_id] = this.#listeners[_id] || [];
        this.#listeners[_id].push(callback);
    }

    #fetch(command:string, args:any) {
        return new Promise((resolve, reject) => {
            const _id = generateId();
            postMessage({ _id, command, ...args });
            this.#addListener(_id, (data: any) => {
                if (data.errorMessage) {
                    reject(data);
                } else {
                    resolve(data);
                }
            });
        });
    }

    #onMessage(event:any) {
        console.log("SDK : @onMessage", event.origin, "!==", self.location.origin);
        if (event.origin !== self.location.origin) {
            console.log("SDK : @onMessage ", event);
            const data = event.data;
            const _req = data._req || {};
            let listeners = this.#listeners[_req._id] || [];
            if (listeners) {
                listeners.forEach((listener:any) => {
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

function initSDK(config:any = {}) {
    if (config.flow === "Process") {
        return new ProcessSdk(config);
    }
    return new LcncSdk(config);
}

export default initSDK;
