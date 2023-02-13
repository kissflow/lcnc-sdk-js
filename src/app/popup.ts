import { BaseSDK, DEFAULTS, LISTENER_CMDS } from "../core/index";

import { Component } from "./component";

import { PopupContext } from "../types/internal";

export class Popup extends BaseSDK {
	_id: string;
	type: string;
	constructor(props: PopupContext) {
		super();
		this.type = "Popup";
		this._id = props.popupId || DEFAULTS.POPUP_ID;
	}
	getParameter(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_POPUP_PARAMS, {
			key,
			popupId: this._id
		});
	}
	getAllParameters() {
		return this._postMessageAsync(LISTENER_CMDS.GET_ALL_POPUP_PARAMS, {
			popupId: this._id
		});
	}
	close() {
		return this._postMessageAsync(LISTENER_CMDS.CLOSE_POPUP, {});
	}
	getComponent(componentId: string): Component {
		return this._postMessageAsync(
			LISTENER_CMDS.COMPONENT_GET,
			{ componentId },
			true, // has callBack
			(data) => {
				return new Component(data);
			}
		);
	}
}
