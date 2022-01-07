import LowcodeSDK from "./lowcode.sdk";

if (typeof _BUILD !== "undefined" && _BUILD) {
	self.KF = LowcodeSDK;
}

export default LowcodeSDK;
