import LCNCSDK from './lcnc-sdk.js';

if (typeof _BUILD !== "undefined" && _BUILD) {
    window.LCNC = LCNCSDK;
}

export default LCNCSDK;