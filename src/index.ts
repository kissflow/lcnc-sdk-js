import LCNCSDK from "./lcnc.sdk";

if (
	(typeof _BUILD !== "undefined" && _BUILD)
  //  || self?.accountDetails?._id !== ""
) {
	self.LCNC = LCNCSDK;
}

export default LCNCSDK;
