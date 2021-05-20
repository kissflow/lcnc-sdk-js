class LCNCHandler {
    constructor(props) {
        console.log("Initializing LCNC HANDLER", props);
        this._onMessage = this._onMessage.bind(this);
        window.addEventListener("message", this._onMessage, false);
    }

    _onMessage(event) {
        console.log("Parent receives messsage", event);
        const data = event.data;
        this.execute(event.data, event.source);
    }

    execute(data, sourceWindow) {
        switch (data.command) {
            case "PARAMS":
                this.sendBack(sourceWindow, data, {value: "message from parent"});
                break;
            case "API":
                fetch(data.url).then(async (resp) => {
                    const json = await resp.json();
                    this.sendBack(sourceWindow, data, json);
                });
                break;
            case "REDIRECT":
                window.location.href = data.url;
                break;
            default:
                console.log("Command not specified", data);
          }
    }

    sendBack(sourceWindow, req, res) {
        if(req._id) {
            sourceWindow.postMessage({_req :req, res}, "*")
        }
    }
    
}

function initHandler(options = {}) {
    return new LCNCHandler(options);
}

export default initHandler