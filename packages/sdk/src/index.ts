import { BaseSDK, LISTENER_CMDS } from "./core";

import { Application, Page, CustomComponent } from "./app";
import { Client, Formatter } from "./utils";

import { userObject, accountObject, environmentObject } from "./types/external";

class CustomComponentSDK extends BaseSDK {
	app: Application;
	page: Page;
	user: userObject;
	account: accountObject;
	context: CustomComponent;
	client: Client;
	formatter: Formatter;
	env: environmentObject;

	constructor() {
		super();
	}
	api(url: string, args = {}): string | object {
		return this._postMessageAsync(LISTENER_CMDS.API, { url, args });
	}
	initialize() {
		if (globalThis.parent && globalThis.parent === globalThis) {
			return Promise.reject(
				"SDK can be initialized only inside the Kissflow platform."
			);
		}
		return this._postMessageAsync(
			LISTENER_CMDS.CC_INITIALIZE,
			{},
			true,
			(data) => {
				this.app = new Application(data);
				this.page = new Page(data);
				this.context = new CustomComponent(data.componentId);
				this.client = new Client();
				this.formatter = new Formatter();
				this.user = data.user;
				this.account = data.account;
				this.env = data.envDetails;
				return this;
			}
		);
	}
	initialise() {
		return this.initialize();
	}
}

export default new CustomComponentSDK();
