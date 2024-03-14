import { nanoid } from "nanoid";

import { LISTENER_CMDS } from "./constants";

export function generateId(prefix = "lcncsdk") {
	return `${prefix}-${nanoid()}`;
}
export const globalInstances = {};

function processResponse(req: object, resp: object) {
	if (
		resp &&
		Object.keys(resp).length === 1 &&
		req.command !== LISTENER_CMDS.API
	) {
		let value = Object.values(resp)[0];
		if (value === "undefined") return undefined;
		return value;
	} else {
		return resp;
	}
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
					let processedResp = processResponse(req, resp);
					listener(processedResp)
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

	_postMessageSync(command: string, args) {
		let intialValue = 0;
		const _id = generateId(command.toLowerCase());

		let data = { _id, command, ...args }

		let atomics = new AtomicsHandler()
		atomics.store(0, intialValue);
		atomics.encodeData(1, data);
		postMessage(atomics.sab);
		atomics.wait(0, intialValue, 10000)
		let decodedData = atomics.decodeData()

		let { _req: req, resp } = decodedData;
		let processedResp = processResponse(req, resp);

		if (processedResp?.isError) {
			throw new Error(`Error: ${JSON.stringify(processedResp, null, 2)}`);
		}

		return processedResp;
	}
}



class AtomicsHandler {
	sab: SharedArrayBuffer;
	int32Array: Int32Array;

	constructor(sab?: SharedArrayBuffer) {
		this.sab = sab || new SharedArrayBuffer(1024 * 1024); //1mb;
		this.int32Array = new Int32Array(this.sab);
	}

	#textEncoder = new TextEncoder();
	#textDecoder = new TextDecoder();

	load(index: number = 0) {
		return Atomics.load(this.int32Array, index);
	}

	store(index: number = 0, data: any) {
		return Atomics.store(this.int32Array, index, data);
	}

	notify(index: number = 0, count: number = 1) {
		// eslint-disable-next-line no-undef
		return Atomics.notify(this.int32Array, index, count);
	}

	wait(index: number, value: number, timeout: number) {
		return Atomics.wait(this.int32Array, index, value, timeout);
	}

	encodeData(index: number = 0, data: object) {
		const replacer = (key, value) => (value === undefined ? 'undefined' : value);
		let string = JSON.stringify(data, replacer);
		let encodedData = this.#textEncoder.encode(string);
		this.int32Array.set(encodedData, index);
		return this.int32Array;
	}

	decodeData() {
		let string = this.#textDecoder
			//we can't decode sharedBuffer typed array directly so we need to slice it
			.decode(this.int32Array.slice())
			.replace(/\x00/g, ""); // to remove null bytes
		return JSON.parse(string);
	}
}

export * from "./constants";
