import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";
import { Client } from "./client";
import { Formatter } from "./formatter";
import { Application } from "./app";
import { Page } from "./page";
import { CustomComponent } from "./component";

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
		return this._postMessageAsync(
			LISTENER_CMDS.INITIALIZE_CUST_COMP,
			{},
			true,
			(data) => {
				this.app = new Application(data);
				this.page = new Page(data);
				this.context = new CustomComponent();
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
