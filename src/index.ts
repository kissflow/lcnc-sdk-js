import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";
import { Form } from "./form";
import { TableForm } from "./form";
import { Client } from "./client";
import { Formatter } from "./formatter";
import { Application } from "./app";
import { Page } from "./page";
import { Component, CustomComponent } from "./component";
import { Popup } from "./popup";

import { SDKContext } from "./types/internal";
import { userObject, accountObject } from "./types/external";

class LowcodeSDK extends BaseSDK {
	context: Component | Form | TableForm | Page | Popup;
	client: Client;
	formatter: Formatter;
	app: Application;
	user: userObject;
	account: accountObject;

	constructor(props: SDKContext) {
		super({});
		if (props.tableId && props.tableRowId) {
			this.context = new TableForm(
				props.formInstanceId,
				props.tableId,
				props.tableRowId
			);
		} else if (props.formInstanceId) {
			this.context = new Form(props.formInstanceId);
		} else if (props.popupId) {
			this.context = new Popup(props);
		} else if (props.pageId && !props.componentId) {
			this.context = new Page(props);
		} else if (props.componentId) {
			this.context = new Component(props);
		}
		this.client = new Client({});
		this.formatter = new Formatter({});
		if (props.appId) {
			this.app = new Application(props);
		}
		this.user = props.user;
		this.account = props.account;
	}
	api(url: string, args = {}): string | object {
		return this._postMessageAsync(LISTENER_CMDS.API, { url, args });
	}
}

class CustomComponentSDK extends BaseSDK {
	app: Application;
	page: Page;
	user: userObject;
	account: accountObject;
	context: CustomComponent;
	client: Client;
	formatter: Formatter;
	constructor() {
		super({});
		return this._postMessageAsync(
			LISTENER_CMDS.INITIALIZE_CUST_COMP,
			{},
			true,
			(data) => {
				this.app = new Application(data);
				this.page = new Page(data);
				this.context = new CustomComponent();
				this.client = new Client({});
				this.formatter = new Formatter({});
				this.user = data.user;
				this.account = data.account;
				return this;
			}
		);
	}
	api(url: string, args = {}): string | object {
		return this._postMessageAsync(LISTENER_CMDS.API, { url, args });
	}
}

function initSDK(config: SDKContext): CustomComponentSDK | LowcodeSDK {
	if (config?.appId) {
		return new LowcodeSDK(config);
	}
	return new CustomComponentSDK();
}

export default initSDK;
