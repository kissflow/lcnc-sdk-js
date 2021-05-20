function generateId() {
    return Math.floor(Date.now()).toString(36);
}

function postMessage(args) {
    if (window.parent !== window) {
        window.parent.postMessage(args, "*");
    }
}
  
class LcncSdk {
    constructor(props) {
        console.log("Initializing LCNC SDK", props);
        this._listeners = {};
        this._onMessage = this._onMessage.bind(this);

        window.addEventListener("message", this._onMessage, false);
    }

    api(url, args={}) {
        return this._fetch("API", { url, args });
    }

    watchParams(args={}) {
        return this._fetch("PARAMS", args);
    }

    _addListener(_id, callback) {
        this._listeners[_id] = this._listeners[_id] || [];
        this._listeners[_id].push(callback);
    }

    _fetch(command, args) {
        return new Promise((resolve, reject) => {
            const _id = generateId();
            postMessage({_id, command, ...args});
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
        console.log(event.origin, "!==", location.origin);
        if (event.origin !== location.origin) {
            console.log("child receives messsage", event);
            const data = event.data;
            const _req = data._req || {}
            let listeners = this._listeners[_req._id] || [];

            if (listeners) {
                listeners.forEach(listener => {
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

export default initSDK