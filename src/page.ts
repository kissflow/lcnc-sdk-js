import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Page extends BaseSDK {
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
		return this._postMessageAsync(LISTENER_CMDS.OPEN_POPUP_PAGE, {
			pageId,
			inputParams,
			popupProperties: {
				width: popupProperties.w,
				height: popupProperties.h
			}
		});
	}
}
