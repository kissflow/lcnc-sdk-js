import { windowHandler } from "./window.handler.js";

const worker = new Worker("./worker.js", {
  type: "module"
});

worker.addEventListener("message", (evt) => {
  console.log("message from worker ", evt);
  let { command } = evt.data;
  if(command.startsWith("WINDOW")) {
    windowHandler({worker: worker, ...evt.data});
  }
  // let { command, sab, ...args} = evt.data;
  // let int32Array = new Int32Array(sab);
  // let data = JSON.stringify({value: 10});
  // // write datalength in first index
  // Atomics.store(int32Array, 0, data.length); // datalength
  // for(let i = 0; i < data.length; i++) {
  //   int32Array[i+1] = data.charCodeAt(i);
  // }
  // //write logic on 
  // Atomics.notify(int32Array, 0);
});


document.addEventListener("click", (evt) => {
  switch(evt.target.id) {
    case "scan":
      worker.postMessage({cmd: "scan"})
    case "write":
      worker.postMessage({cmd: "write"})
      break;
    case "cancelScan":
      worker.postMessage({cmd: "cancelScan"})
      break;
    default:
  }
})