const globalInstances = {};
const globalHandlers = {}
export function windowHandler(event) {
  let { command } = event;
  let [,handlerName,] = command.split("_");
  globalHandlers[handlerName]?.(event);
}

globalHandlers["NDEFReader"] = NDEFReaderHandler;
function NDEFReaderHandler(event) {
  switch(event.command) {
    case "WINDOW_NDEFReader_NEW":
      let ins = new window.NDEFReader();
      globalInstances[event.id] = ins;
    case "WINDOW_NDEFReader_ADDEVENTLISTENER":
      ins = globalInstances[event.id];
      ins.addEventListener(event.eventName, (data) => {
        // fire the postmessage to communicate to worker thread with data
        worker.postMessage({eventName: event.eventName, isEvent: true, target: event.id, data});
      });
    case "WINDOW_NDEFReader_SCAN":
      ins = globalInstances[event.id];
      ins.scan().then((data) => {
        //postmessage about sucess
        let { worker, ...rest } = event;
        worker.postMessage({ _req: rest, res: data});
      }).catch(err => {
        let { worker, ...rest } = event;
        worker.postMessage({ _req: rest, err: err});
        //postmessage about failure
      });
    case "WINDOW_NDEFReader_WRITE":
      ins = globalInstances[event.id];
      ins.write(event.data).then(() => {
        //postmessage about sucess
        let { worker, ...rest } = event;
        worker.postMessage({ _req: rest, res: data});
      }).catch(err => {
        //postmessage about failure
        let { worker, ...rest } = event;
        worker.postMessage({ _req: rest, err: err});
      });
    default:
  }
}