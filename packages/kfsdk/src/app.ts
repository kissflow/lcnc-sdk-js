import { BaseSDK } from "./base";
import { Page } from "./page";
import { LISTENER_CMDS } from "./constants";

import { AppContext } from "./types/internal";

export class Application extends BaseSDK {
	page: Page;
	_id: string;
	variable: Object
	constructor(props: AppContext) {
		super({});
		this._id = props.appId;
		this.page = new Page(props);
		const app = this;
		this.variable = new Proxy({}, {
			get(target, propName) {
				let value = app._postMessageSync(LISTENER_CMDS.GET_APP_VARIABLE, {
					key: propName
				});
				console.log("received value", value);
				return value;
			},
			set(target, propName, value) {
				app._postMessageSync(LISTENER_CMDS.GET_APP_VARIABLE, {
					key: propName,
					value
				});
				console.log("received value", value);
				return true;
			}
		})
	}
	getVariable(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_APP_VARIABLE, {
			key
		});
	}

	setVariable(key: string | object, value: any) {
		return this._postMessageAsync(LISTENER_CMDS.SET_APP_VARIABLE, {
			key,
			value
		});
	}

	openPage(pageId: string, pageParams: object) {
		return this._postMessageAsync(LISTENER_CMDS.OPEN_PAGE, {
			pageId,
			pageParams
		});
	}
}
