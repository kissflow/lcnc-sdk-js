import { BaseSDK, LISTENER_CMDS } from "../core";

import { Page } from "./page";

import { AppContext } from "../types/internal";

import { DecisionTable } from "./decisiontable";
import { Dataform } from "./dataform";

export class Application extends BaseSDK {
	page: Page;
	_id: string;

	constructor(props: AppContext) {
		super();
		this._id = props.appId;
		this.page = new Page(props);
	}
	getVariable(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_APP_VARIABLE, {
			key
		});
	}

	setVariable(key: string | object, value?: any) {
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

	getDecisionTable(flowId: string): DecisionTable {
		return new DecisionTable(flowId);
	}

	getDataform(flowId: string): Dataform {
		return new Dataform(flowId);
	}
}

export * from "./component";
export { Page };
export * from "./popup";
