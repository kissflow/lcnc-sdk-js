import initSDK, { window } from "./dist/kfworkersdk.es.js";

const kf = initSDK({
  appId: "app001",
  page: {_id: "page001"},
  user: {_id: "user001", Name: "User 001", Kind: "User", Email: "user001@kissflow.com", UserType: "Admin"},
  account: {_id: "account001"}
});

console.log("window object ", new window.NDEFReader());

console.log("created kf instance ", kf);
console.log("variable value ", kf.app.variable.name);
console.log("done");
