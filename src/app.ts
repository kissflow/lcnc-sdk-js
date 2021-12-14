import { BaseSDK } from "./base";
import { Page } from "./page";
import { LISTENER_CMDS } from "./constants";

export class Application extends BaseSDK {
	page: Page;

	constructor(props: any) {
		super({});
		this.page = new Page({});
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
		return super._postMessageAsync(LISTENER_CMDS.OPEN_PAGE, {
			pageId,
			pageParams
		});
	}
}
