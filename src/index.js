import LCNCSDK from './lcnc-sdk.js';
import LCNCHandler from './lcnc-handler.js';

if (typeof _BUILD !== "undefined" && _BUILD) {
    window.LCNC = LCNCSDK;
}

//temp code to check handler from iframes
LCNCHandler();

export default LCNCSDK;