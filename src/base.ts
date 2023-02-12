import { nanoid } from "nanoid";

import { LISTENER_CMDS } from "./constants";
import { globalInstances } from "./utils";

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

function onMessage(event) {
	if (event.origin !== globalThis.location.origin) {
		const data = event.data;
		if (data?.isEvent) {
			const { target, eventParams, eventName, eventConfig = {} } = data;
			let targetInstance = globalInstances[target];
			targetInstance._dispatchEvent(eventName, eventParams);
			if (eventConfig.once) {
				targetInstance._removeEventListener(eventName);
			}
			return;
		}
		let { _req: req, resp } = data;
		if (req?._id) {
			let targetInstance = globalInstances[req._id];
			targetInstance._dispatchMessageEvents(req, resp);
		}
	}
}

globalThis.addEventListener("message", onMessage);

export class EventBase {
	#listeners: {
		[key: string]: Function[];
	};

	constructor() {
		this.#listeners = {};
	}

	_addEventListener(eventName: string, callBack: Function) {
		this.#listeners[eventName] = this.#listeners?.[eventName] || [];
		this.#listeners[eventName].push(callBack);
	}

	_removeEventListener(eventName: string, callBack?: any) {
		if (callBack) {
			let index = this.#listeners[eventName].findIndex(callBack);
			index > -1 && this.#listeners[eventName].splice(index, 1);
			return;
		}
		Reflect.deleteProperty(this.#listeners, eventName);
	}

	_dispatchEvent(eventName: string, eventParams: object) {
		if (Array.isArray(this.#listeners[eventName])) {
			this.#listeners[eventName].forEach((callBack) =>
				callBack(eventParams)
			);
			return true;
		}
		return false;
	}

	_dispatchMessageEvents(req, resp) {
		let target = req._id;
		if (Array.isArray(this.#listeners[target])) {
			this.#listeners[target].forEach((listener: any) => {
				try {
					if (
						resp &&
						Object.keys(resp).length === 1 &&
						req.command !== LISTENER_CMDS.API
					) {
						listener(Object.values(resp)[0]);
					} else {
						listener(resp);
					}
				} catch (err) {
					console.error("Message callback error: ", err);
				}
			});
			this._removeEventListener(target);
		}
	}
}

export class BaseSDK extends EventBase {
	_postMessageAsync(
		command: string,
		args: any,
		hasCallBack?: boolean,
		callBack?: (data: any) => {}
	): object | string | any {
		return new Promise((resolve, reject) => {
			const _id = generateId(command.toLowerCase());
			postMessage({ _id, command, ...args });

			globalInstances[_id] = this;

			this._addEventListener(_id, async (data: any) => {
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

	_postMessage(command: string, args, callBack?) {
		const _id = generateId(command.toLowerCase());
		postMessage({ _id, command, ...args });
		if (callBack) {
			this._addEventListener(args.eventName, callBack);
		}
	}
}
