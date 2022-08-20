import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

import { ComponentProps } from "./sdk.types";

export class Component extends BaseSDK {
	_id: string;
	pageId: string;
	constructor(props: ComponentProps) {
		super({});
		this._id = props.componentId;
		this.pageId = props.pageId;
		// if (props.manifestMethods) {
		// 	props.manifestMethods.forEach((method) => {
		// 		this[method.name] = (...args) =>
		// 			this._postMessageAsync(`COMPONENT_${method.name}`, {
		// 				id: this._id,
		// 				...args
		// 			});
		// 	});
		// }
	}
	refresh() {
		return this._postMessageAsync(LISTENER_CMDS.COMPONENT_REFRESH, {
			id: this._id,
			pageId: this.pageId
		});
	}
	show() {
		return this._postMessageAsync(LISTENER_CMDS.COMPONENT_SHOW, {
			id: this._id,
			pageId: this.pageId
		});
	}
	hide() {
		return this._postMessageAsync(LISTENER_CMDS.COMPONENT_HIDE, {
			id: this._id,
			pageId: this.pageId
		});
	}
	watchParams(func: (data: any) => any) {
		this._postMessage(LISTENER_CMDS.PARAMS, func);
	}
}
