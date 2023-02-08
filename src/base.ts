import { nanoid } from "nanoid";

import { LISTENER_CMDS } from "./constants";
import { globalInstances, globalMessageListeners } from "./utils";

function generateId(prefix = "lcncsdk") {
	return `${prefix}-${nanoid()}`;
}

function postMessage(args: any) {
	// console.log("SDK : @postMessage ", args);
	if (globalThis.parent && globalThis.parent !== globalThis) {
		globalThis.parent.postMessage(args, "*");
	} else {
		globalThis.postMessage(args);
	}
}

export class BaseSDK {
	constructor(props: any) {
		if (!globalInstances["base"]) {
			globalThis.addEventListener(
				"message",
				this.#onMessage.bind(this),
				false
			);
			globalInstances["base"] = this;
		}
	}

	#addMessageListener(_id: string, callback: any) {

		globalMessageListeners[_id] = globalMessageListeners[_id] || [];
		globalMessageListeners[_id].push(callback);
	}

	_postMessageAsync(
		command: string,
		args: any,
		hasCallBack?: boolean,
		callBack?: (data: any) => {}
	): object | string | any {
		return new Promise((resolve, reject) => {
			const _id = generateId(command.toLowerCase());
			postMessage({ _id, command, ...args });
			this.#addMessageListener(_id, async (data: any) => {
				if (data?.errorMessage) {
					reject(data);
				} else {
					if (hasCallBack && callBack) {
						data = await callBack(data);
					}
					resolve(data);
				}
			});
		});
	}

	_postMessage(command: string, args) {
		const _id = generateId(command.toLowerCase());
		postMessage({ _id, command, ...args });
		// this.#addMessageListener(_id, (data: any) => func(data));
	}

	#executeEvent(eventData: any) {
		const { target, eventParams, eventName, eventConfig = {} } = eventData;
		if (!target) return;
		globalInstances[target]?.triggerEvent(eventName, eventParams);
		if (eventConfig.once) {
			globalInstances[target]?.removeEventListener(eventName);
		}
	}

	#onMessage(event: any) {
		if (event.origin !== globalThis.location.origin) {
			// console.log("SDK : @onMessage ", event);
			const data = event.data;
			if (data.isEvent) {
				return this.#executeEvent(data);
			}
			const _req = data?._req || {};
			let listeners = globalMessageListeners[_req?._id] || [];
			if (listeners) {
				listeners.forEach((listener: any) => {
					try {
						if (
							data.resp &&
							Object.keys(data.resp).length === 1 &&
							_req.command !== LISTENER_CMDS.API
						) {
							listener(Object.values(data.resp)[0]);
						} else {
							listener(data.resp);
						}
					} catch (err) {
						console.error("Message callback error: ", err);
					}
				});
			}
		}
	}
}

export class EventBase extends BaseSDK {
	#eventListeners: {
		[key: string]: Function[];
	};

	constructor() {
		super({});
		this.#eventListeners = {};
	}

	addEventListener(eventName: string, callBack: Function) {
		this.#eventListeners[eventName] =
			this.#eventListeners?.[eventName] || [];
		this.#eventListeners[eventName].push(callBack);
	}

	removeEventListener(eventName: string, callBack?: any) {
		if (callBack) {
			let index = this.#eventListeners[eventName].findIndex(callBack);
			index > -1 && this.#eventListeners[eventName].splice(index, 1);
			return;
		}
		Reflect.deleteProperty(this.#eventListeners, eventName);
	}
	triggerEvent(eventName: string, data: object) {
		if (Array.isArray(this.#eventListeners[eventName])) {
			this.#eventListeners[eventName].forEach((callBack) =>
				callBack(data)
			);
			return true;
		}
		return false;
	}
}
