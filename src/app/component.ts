import { BaseSDK, globalInstances, LISTENER_CMDS, EVENT_TYPES } from "../core";

import { ComponentProps } from "../types/internal";

export class Component extends BaseSDK {
	_id: string;
	type: string;

	#registerComponentAPIs(componentAPIs) {
		componentAPIs?.forEach((Api) => {
			this[Api.name] = (...args) => {
				if (Api.type === "method") {
					return this._postMessageAsync(`COMPONENT_${Api.name}`, {
						id: this._id,
						parameters: args
					});
				} else if (Api.type === "event") {
					this._postMessage(
						LISTENER_CMDS.COMPONENT_ADD_EVENT_LISTENER,
						{
							id: this._id,
							eventName: Api.name,
							eventConfig: args[1]
						},
						args[0]
					);
				}
			};
		});
	}

	constructor(props: ComponentProps) {
		super();
		this._id = props.componentId;
		this.type = "Component";
		globalInstances[this._id] = this;
		this.#registerComponentAPIs(props.componentMethods);
	}

	onMount(callback: Function): void {
		this._postMessage(
			LISTENER_CMDS.COMPONENT_ADD_EVENT_LISTENER,
			{
				id: this._id,
				eventName: EVENT_TYPES.COMPONENT_ON_MOUNT,
				eventConfig: {
					once: true
				}
			},
			callback
		);
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
	_id: string;
	constructor(id) {
		super();
		this._id = id;
		this.type = "CustomComponent";
		globalInstances[this._id] = this;
	}
	watchParams(callBack: (data: any) => any) {
		this._postMessage(
			LISTENER_CMDS.CC_WATCH_PARAMS,
			{
				id: this._id,
				eventName: EVENT_TYPES.CC_ON_PARAMS_CHANGE,
				eventConfig: {
					once: false
				}
			},
			callBack
		);
	}
}
