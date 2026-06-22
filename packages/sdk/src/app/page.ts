import { BaseSDK, LISTENER_CMDS } from "../core";

import { Component } from "./component";
import { Popup } from "./popup";

import { PageContext } from "../types/internal";
import { CreateProxy } from "../core/proxy";

export class Page extends BaseSDK {
	_id: string;
	popup: Popup;
	type: string;
	_route: string;
	// variable: PageVariable;

	constructor(props: PageContext, isCustomComponent: boolean = false) {
		super();
		this.type = "Page";
		this.popup = new Popup({});
		this._id = props.pageId;
		this._route = props.initialRoute ?? "";
		// /* Note: Synchronous variable read/write is not supported for custom components
		//  * as it is not possible to use Atomics.wait in the main thread and iframe thread
		//  */
		// !isCustomComponent && (this.variable = new PageVariable());
	}
	getParameter(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_PARAMS, {
			key
		});
	}
	getAllParameters() {
		return this._postMessageAsync(LISTENER_CMDS.GET_ALL_PAGE_PARAMS, {
			pageId: this._id
		});
	}
	getVariable(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_VARIABLE, {
			key
		});
	}
	setVariable(key: string | object, value?: any) {
		return this._postMessageAsync(LISTENER_CMDS.SET_PAGE_VARIABLE, {
			key,
			value
		});
	}
	openPopup(popupId: string, popupParams?: object) {
		return this._postMessageAsync(LISTENER_CMDS.OPEN_POPUP, {
			popupId,
			popupParams
		});
	}
	getComponent(componentId: string): Component {
		return this._postMessageAsync(
			LISTENER_CMDS.COMPONENT_GET,
			{ componentId },
			true,
			(data) => new Component(data)
		);
	}
	/**
	 * Notify the Kissflow host that the custom UI navigated to `path`,
	 * so the parent browser URL mirrors the route. Used by the App UI framework.
	 */
	setRoute(path: string) {
		this._route = path;
		return this._postMessage(LISTENER_CMDS.CC_SET_ROUTE, { route: path });
	}
	/** Returns the initial deep-link route the page was opened with. */
	getRoute(): string {
		return this._route;
	}
}


class PageVariable extends BaseSDK {
	constructor() {
		super()
		return new CreateProxy(this)
	}

	get(key, path) {
		let args = {
			key,
			path: path
		}
		return this._postMessageSync(LISTENER_CMDS.GET_PAGE_VARIABLE, args);
	}

	set(key, value, path) {
		let args = {
			key,
			value,
			path
		}
		return this._postMessageSync(LISTENER_CMDS.SET_PAGE_VARIABLE, args);
	}
}