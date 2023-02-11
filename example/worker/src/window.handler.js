const globalInstances = {};
const globalHandlers = {}
export function windowHandler(event) {
  let { command } = event;
  let [,handlerName,] = command.split("_");
  globalHandlers[handlerName]?.(event);
}

globalHandlers["NDEFReader"] = NDEFReaderHandler;
function NDEFReaderHandler(event) {
  console.log("windoe received event ", event);
  switch(event.command) {
    case "WINDOW_NDEFReader_NEW":
      {
        let ins = new window.NDEFReader();
        globalInstances[event.id] = ins;
        console.log("craeted instance ", event);
      }
      break;
    case "WINDOW_NDEFReader_ADD_EVENT_LISTENER":
      {
        const ins = globalInstances[event.id];
        console.log("add event listener called ", event);
        ins.addEventListener(event.eventName, async (evtData) => {
          console.log("fired event listener ", event.eventName, evtData);
          switch(event.eventName) {
            case "reading":
              const ndefMessage = evtData.message;
              let messages = [];
              for await (const record of ndefMessage.records) {
                let obj = {
                  recordType: record.recordType,
                  mediaType: record.mediaType,
                  id: record.id,
                  data: await new Response(record.data).text()
                };
                console.log('Record data ', obj);
              }
              evtData = messages;
              break;
            case "readingerror":
              evtData = evtData.toString();
              break;
            default:
              console.error("Could not read from NFC ", event);
          }
          // fire the postmessage to communicate to worker thread with data
          event.worker.postMessage({eventName: event.eventName, isEvent: true, target: event.id, data: evtData});
        }, event.config || {});
      }
      break;
    case "WINDOW_NDEFReader_SCAN":
      {
        console.log("scan method called ", event);
        const ins = globalInstances[event.id];
        let abortController = new AbortController();
        //keeping the referrence so this operation can be cancelled
        ins.abortController = abortController;
        ins.scan({ signal: abortController.signal }).then((data) => {
          console.error("scanning in in window ", data);
          let { worker, ...rest } = event;
          worker.postMessage({ _req: rest, resp: {data: { data }}});
        }).catch(err => {
          console.error("error in scan ", err);
          let { worker, ...rest } = event;
          worker.postMessage({ _req: rest, resp: {data: {err: err}}});
        });
      }
      break;
    case "WINDOW_NDEFReader_WRITE":
      {
        const ins = globalInstances[event.id];
        ins.write(event.data).then(() => {
          let { worker, ...rest } = event;
          worker.postMessage({ _req: rest, resp: {data: {message: "Successfull"}}});
        }).catch(err => {
          console.error("error in write ", err);
          let { worker, ...rest } = event;
          worker.postMessage({ _req: rest, resp: {data: {err: {name: err.name, message: err.message}}}});
        });
      }
      break;
    case "WINDOW_NDEFReader_ABORT_SCAN":
      {
        const ins = globalInstances[event.id];
        ins?.abortController.abort();
        console.log("scan aborted");
      }
    default:
  }
}