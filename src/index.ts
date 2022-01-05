import LowcodeSDK from "./lowcode.sdk";

if (typeof _BUILD !== "undefined" && _BUILD) {
	self.kf = LowcodeSDK;
}

export default LowcodeSDK;
