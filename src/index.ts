import LCNCSDK from "./lcnc.sdk";

if (typeof _BUILD !== "undefined" && _BUILD) {
	self.LCNC = LCNCSDK;
}

export default LCNCSDK;
