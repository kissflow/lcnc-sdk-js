import { Component } from "./component";
import { BaseSDK } from "./base";
import { LISTENER_CMDS, EVENT_TYPES } from "./constants";
import { PageContext } from "./sdk.types";

export class Page extends BaseSDK {
	_id: string;
	constructor(props: PageContext) {
		super({});
		this._id = props.pageId;
	}
	getParameter(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_PARAMS, {
			key
		});
	}
	getVariable(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_PAGE_VARIABLE, {
			key
		});
	}
	setVariable(key: string, value: any) {
		return this._postMessageAsync(LISTENER_CMDS.SET_PAGE_VARIABLE, {
			key,
			value
		});
	}
	openPopup(popupId: string, popupParams: object) {
		return this._postMessageAsync(LISTENER_CMDS.OPEN_POPUP_PAGE, {
			popupId,
			popupParams
		});
	}
	closePopup() {
		return this._postMessageAsync(LISTENER_CMDS.CLOSE_POPUP, {});
	}
	getComponent(componentId: string): Component {
		return this._postMessageAsync(
			LISTENER_CMDS.GET_COMPONENT,
			{ id: componentId, pageId: this._id },
			true, // has callBack
			(data) => {
				return new Component(data);
			}
		);
	}
	onClose(callback: Function) {
		this._registerEventListener(this._id, EVENT_TYPES.ON_CLOSE, callback);
	}
}
