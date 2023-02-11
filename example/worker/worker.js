import initSDK, { window } from "./dist/kfworkersdk.es.js";

const kf = initSDK({
  appId: "app001",
  page: {_id: "page001"},
  user: {_id: "user001", Name: "User 001", Kind: "User", Email: "user001@kissflow.com", UserType: "Admin"},
  account: {_id: "account001"}
});

console.log("window object ");
let reader = new window.NDEFReader();
reader.addEventListener("reading", (data) => {
  console.log("read event is fired in worker ", data);
});
reader.addEventListener("readingerror", (err) => {
  console.log("reading error is fired in worker ", err);
});
// reader.write("hello");
// console.log("created kf instance ", kf);
// console.log("variable value ", kf.app.variable.name);
console.log("done");

self.onmessage = function(evt) {
  switch(evt.data.cmd) {
    case "scan":
      reader.scan().then((data) => {
        console.log("scaning ... ",data);
      }).catch(err => {
        console.log("scanning error in worker ", err);
      });
      break;  
    case "write":
      reader.write("hello " + Math.random())
      .then(data => {
        console.log("write success in worker ", data);
      })
      .catch(err => {
        console.error("write error in worker ", err);
      });
      break;
    case "cancelScan":
      reader.abortScan()
        .then(() => console.log("scan aborted in worker"));
      break;
    default:
  }
}
