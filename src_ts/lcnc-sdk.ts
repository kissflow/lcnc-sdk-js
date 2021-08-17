import { BaseSDK } from "./base.js";
import { Form } from "./form.js";
import { Client } from "./client.js";
import { LISTENER_CMDS } from "./constants.js";

export class LcncSDK extends BaseSDK {
	currentForm: Form;
	client: Client;

	constructor(props: any) {
		super({});
		this.currentForm = new Form({});
		this.client = new Client({});
	}

	api(url: string, args = {}) {
		return this._postMessageUtil(LISTENER_CMDS.API, { url, args });
	}

	watchParams(func: (data: any) => any) {
		return this._watchMessageUtil(LISTENER_CMDS.PARAMS, func);
	}

	getAccountContext() {
		return this._postMessageUtil(LISTENER_CMDS.ACCOUNT_CONTEXT, {});
	}
	redirect(url: string, shouldConfirm: any) {
		return this._postMessageUtil(LISTENER_CMDS.REDIRECT, { url });
	}
}

function initSDK(config: any = {}) {
	return new LcncSDK(config);
}

export default initSDK;
