import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";
import { Form } from "./form";
import { Client } from "./client";
import { Formatter } from './formatter';
import { Application } from "./app";
import { Page } from "./page";
import { Component } from "./component";
export class LcncSDK extends BaseSDK {
	currentForm: Form;
	client: Client;
	formatter: Formatter;
	app: Application;
	page: Page;

	constructor(props: any) {
		super({});
		this.currentForm = new Form({});
		this.client = new Client({});
		this.formatter = new Formatter({});
		this.app = new Application({});
		this.page = new Page({});
	}

	api(url: string, args = {}): string | object {
		return this._postMessageAsync(LISTENER_CMDS.API, { url, args });
	}
	watchParams(func: (data: any) => any){
		this._postMessage(LISTENER_CMDS.PARAMS, func);
	}
	getAccountContext(): string | object {
		return this._postMessageAsync(LISTENER_CMDS.ACCOUNT_CONTEXT, {});
	}
	getComponent(componentId: string): Component {
		return new Component(componentId);
	}
}

function initSDK(config: any = {}): LcncSDK {
	return new LcncSDK(config);
}

export default initSDK;