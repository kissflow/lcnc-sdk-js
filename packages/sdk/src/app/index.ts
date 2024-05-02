import { BaseSDK, LISTENER_CMDS } from "../core";
import { CreateProxy } from "../core/proxy";

import { Page } from "./page";

import { AppContext } from "../types/internal";

import { DecisionTable } from "./decisiontable";
import { Dataform } from "./dataform";
import { Board } from "../board";
import { Process } from "../process";

export class Application extends BaseSDK {
	page: Page;
	// variable: AppVariable;
	_id: string;

	constructor(props: AppContext, isCustomComponent: boolean = false) {
		super();
		this._id = props.appId;
		this.page = new Page(props);
		// /* Note: Synchronous variable read/write is not supported for custom components
		//  * as it is not possible to use Atomics.wait in the main thread and iframe thread
		//  */
		// !isCustomComponent && (this.variable = new AppVariable());
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

	openPage(pageId: string, pageParams?: object) {
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

	getBoard(flowId: string) {
		return new Board(flowId);
	}

	getProcess(flowId: string) {
		return new Process(flowId);
	}
}


class AppVariable extends BaseSDK {
	constructor() {
		super()
		return new CreateProxy(this)
	}

	get(key, path) {
		let args = {
			key,
			path: path
		}
		return this._postMessageSync(LISTENER_CMDS.GET_APP_VARIABLE, args);
	}

	set(key, value, path) {
		let args = {
			key,
			value,
			path
		}
		return this._postMessageSync(LISTENER_CMDS.SET_APP_VARIABLE, args);
	}
}

export * from "./component";
export { Page };
export * from "./popup";
