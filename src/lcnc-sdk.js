import { BaseSDK } from "./base.js";
import { Form } from "./form.js";
import { Client } from "./client.js";
import { LISTENER_CMDS } from "./constants.js";
export class LcncSDK extends BaseSDK {
    constructor(props) {
        super({});
        this.currentForm = new Form({});
        this.client = new Client({});
    }
    api(url, args = {}) {
        return this._postMessageUtil(LISTENER_CMDS.API, { url, args });
    }
    watchParams(args = {}) {
        return this._postMessageUtil(LISTENER_CMDS.PARAMS, args);
    }
    getAccountContext() {
        return this._postMessageUtil(LISTENER_CMDS.ACCOUNT_CONTEXT, {});
    }
    redirect(url, shouldConfirm) {
        return this._postMessageUtil(LISTENER_CMDS.REDIRECT, { url });
    }
}
function initSDK(config = {}) {
    return new LcncSDK(config);
}
export default initSDK;
