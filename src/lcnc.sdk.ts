import { BaseSDK } from "./base";
import { Form } from "./form";
import { Client } from "./client";
import { LISTENER_CMDS } from "./constants";
import { Formatter } from './formatter';

export class LcncSDK extends BaseSDK {
	currentForm: Form;
	client: Client;
	formatter: Formatter;

	constructor(props: any) {
		super({});
		this.currentForm = new Form({});
		this.client = new Client({});
		this.formatter = new Formatter({});
	}

	api(url: string, args = {}) {
		return this._postMessageAsync(LISTENER_CMDS.API, { url, args });
	}

	watchParams(func: (data: any) => any) {
		return this._postMessage(LISTENER_CMDS.PARAMS, func);
	}

	getAccountContext() {
		return this._postMessageAsync(LISTENER_CMDS.ACCOUNT_CONTEXT, {});
	}
	redirect(url: string, shouldConfirm: any) {
		return this._postMessageAsync(LISTENER_CMDS.REDIRECT, { url });
	}
}

function initSDK(config: any = {}) {
	return new LcncSDK(config);
}

export default initSDK;
