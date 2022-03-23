import { Component } from './component';
import { BaseSDK } from "./base";
import { LISTENER_CMDS, EVENT_TYPES } from "./constants";

export class Page extends BaseSDK {
	_id: string;
	constructor(pageId: string) {
		super({});
		this._id = pageId;
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
	openPopup(
		pageId: string,
		inputParams: object,
		popupProperties: { w: number; h: number }
	) {
		let payload = {
			pageId,
			inputParams,
			popupProperties: {
				width: popupProperties.w,
				height: popupProperties.h
			}
		};
		return this._postMessageAsync(
			LISTENER_CMDS.OPEN_POPUP_PAGE,
			payload,
			true,
			() => {
				return new Page(pageId);
			}
		);
	}
	closePopup() {
		return this._postMessageAsync(LISTENER_CMDS.CLOSE_POPUP, {});
	}
	getComponent(componentId: string): Component {
		return new Component(componentId);
	}
	onClose(callback: Function) {
		this._registerEventListener(this._id, EVENT_TYPES.ON_CLOSE, callback);
	}
}
