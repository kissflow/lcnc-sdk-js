import { BaseSDK, LISTENER_CMDS } from "../core";
import { CreateProxy } from "../core/proxy";

import { Page } from "./page";

import { AppContext } from "../types/internal";

import { DecisionTable } from "./decisiontable";

export class Application extends BaseSDK {
	page: Page;
	variable: object;
	_id: string;
	constructor(props: AppContext) {
		super();
		this._id = props.appId;
		this.page = new Page(props);
		this.variable = new CreateProxy("app_variable");
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
}

export * from "./component";
export { Page };
export * from "./popup";
