import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

import { ComponentProps } from "./types/internal";

export class Component extends BaseSDK {
	_id: string;
	type: string;
	constructor(props: ComponentProps) {
		super({});
		this._id = props.componentId;
		this.type = "Component";
		props.componentMethods?.forEach((method) => {
			this[method.name] = (...args) =>
				this._postMessageAsync(`COMPONENT_${method.name}`, {
					id: this._id,
					parameters: args
				});
		});
	}
	refresh() {
		return this._postMessageAsync(LISTENER_CMDS.COMPONENT_REFRESH, {
			id: this._id
		});
	}
	show() {
		return this._postMessageAsync(LISTENER_CMDS.COMPONENT_SHOW, {
			id: this._id
		});
	}
	hide() {
		return this._postMessageAsync(LISTENER_CMDS.COMPONENT_HIDE, {
			id: this._id
		});
	}
}

export class CustomComponent extends BaseSDK {
	type: string;
	constructor() {
		super({});
		this.type = "CustomComponent";
	}
	watchParams(func: (data: any) => any) {
		this._postMessage(LISTENER_CMDS.PARAMS, func);
	}
}
