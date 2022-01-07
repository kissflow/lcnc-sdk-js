import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";
import { Form } from "./form";
import { Client } from "./client";
import { Formatter } from './formatter';
import { Application } from "./app";
import { Component } from "./component";

export class LowcodeSDK extends BaseSDK {
	currentForm: Form;
	client: Client;
	formatter: Formatter;
	app: Application;

	constructor(props: any) {
		super({});
		this.currentForm = new Form({});
		this.client = new Client({});
		this.formatter = new Formatter({});
		this.app = new Application({});
	}

	api(url: string, args = {}): string | object {
		return this._postMessageAsync(LISTENER_CMDS.API, { url, args });
	}
	watchParams(func: (data: any) => any) {
		this._postMessage(LISTENER_CMDS.PARAMS, func);
	}
	getContext(): string | object {
		return this._postMessageAsync(LISTENER_CMDS.GET_CONTEXT, {});
	}
	getComponent(componentId: string): Component {
		return new Component(componentId);
	}
}

function initSDK(config: any = {}): LowcodeSDK {
	return new LowcodeSDK(config);
}

export default initSDK;