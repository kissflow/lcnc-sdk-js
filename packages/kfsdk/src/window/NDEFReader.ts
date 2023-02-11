import { BaseSDK, generateId } from "../base";
import { globalInstances } from "../utils";
class EventTarget extends BaseSDK {
  #listeners: {
    [key: string]: Function[]
  };
  constructor(args) {
    super(args);
    this.#listeners = {};
  }
  addEventListener(eventName: string, cb: Function) {
    this.#listeners[eventName] = this.#listeners[eventName] || [];
    this.#listeners[eventName].push(cb);
  }

  removeEventListener(eventName, cb) {
    if(cb) {
      let index = this.#listeners[eventName].findIndex(cb);
      index > -1 && this.#listeners[eventName].splice(index, 1);
      return;
    }
    Reflect.deleteProperty(this.#listeners, eventName);
  }
  triggerEvent(eventName:string, data:object) {
    this.#listeners[eventName].forEach(cb => cb(data))
  }
}

export class NDEFReader extends EventTarget{
  id:string
  constructor(args) {
    super(args);
    this.id = generateId("WINDOW_NEW_NDEFReader");
    globalInstances[this.id] = this;
    this._postMessage("WINDOW_NDEFReader_NEW", (data: any) => {}, { id: this.id, operation: "new" });
  }
  scan() {
    return new Promise((resolve, reject) => {
      this._postMessage("WINDOW_NDEFReader_SCAN", ({data, err}) => {
        console.log("scan data from main window ", data );
        resolve(data);
      }, {id: this.id, operation: "scan"});
    });
  }
  write(data) {
   return new Promise((resolve, reject) => {
    this._postMessage("WINDOW_NDEFReader_WRITE", ({data, err}) => {
        
    }, {id: this.id, operation: "write", data});
   });
  }

  addEventListener(eventName: string, cb: Function): void {
    super.addEventListener(eventName, cb);
    this._postMessage("WINDOW_NDEFReader_ADD_EVENT_LISTENER", () => {}, {id: this.id, operation: "addEventListener", eventName});
  }

  makeReadOnly() {
    return new Promise((resolve, reject) => {
      this._postMessage("WINDOW_NDEFReader_MAKE_READONLY", ({data, err}) => {
          
      }, {id: this.id, operation: "makeReadOnly"});
     });
  }

  abortScan() {
    return new Promise((resolve, reject) => {
      this._postMessage("WINDOW_NDEFReader_ABORT_SCAN", ({data, err}) => {
          
      }, {id: this.id, operation: "abortScan"});
     });
  }
}
