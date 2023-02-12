import { BaseSDK, EventBase } from "./base";
import { LISTENER_CMDS, EVENT_TYPES } from "./constants";

import { globalInstances } from "./utils";

import { ComponentProps } from "./types/internal";

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
		this._postMessage(LISTENER_CMDS.COMPONENT_ADD_EVENT_LISTENER, {
			id: this._id,
			eventName: EVENT_TYPES.COMPONENT_ON_MOUNT,
			eventConfig: {
				once: true
			},
			callback
		});
		this._addEventListener(EVENT_TYPES.COMPONENT_ON_MOUNT, callback);
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
		super();
		this.type = "CustomComponent";
	}
	watchParams(func: (data: any) => any) {
		this._postMessage(LISTENER_CMDS.PARAMS, func);
	}
}
