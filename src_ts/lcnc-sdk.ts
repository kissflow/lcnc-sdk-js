import { LISTENER_CMDS } from "./constants.js";

function generateId(len: number) {
	return Math.floor(Date.now() + len).toString(36);
}

function postMessage(args: any) {
	console.log("SDK : @postMessage ", args);
	if (self.parent && self.parent !== self) {
		self.parent.postMessage(args, "*");
	} else {
		self.postMessage(args);
	}
}

class LcncSdk {
	#listeners: any;
	constructor(props: any) {
		console.log("SDK : Initializing ", props);
		this.#listeners = {};
		self.addEventListener("message", this.#onMessage.bind(this), false);
	}

	api(url: string, args = {}) {
		return this.#postMessageUtil(LISTENER_CMDS.API, { url, args });
	}

	watchParams(args = {}) {
		return this.#postMessageUtil(LISTENER_CMDS.PARAMS, args);
	}

	getAccountContext(args = {}) {
		return this.#postMessageUtil(LISTENER_CMDS.ACCOUNT_CONTEXT, args);
	}

	showInfo(message: string) {
		return this.#postMessageUtil(LISTENER_CMDS.MESSAGE, { message });
	}

	getFormField(fieldId: string) {
		return this.#postMessageUtil(LISTENER_CMDS.GETFORMFIELD, { fieldId });
	}

	getFormTableField(tableId: string, rowIndex: number, fieldId: string) {
		return this.#postMessageUtil(LISTENER_CMDS.GETFORMTABLEFIELD, {
			tableId,
			rowIndex,
			fieldId
		});
	}

	updateForm(args = {}) {
		return this.#postMessageUtil(LISTENER_CMDS.UPDATEFORM, { data: args });
	}

	updateFormTable(args = {}) {
		return this.#postMessageUtil(LISTENER_CMDS.UPDATEFORMTABLE, {
			data: args
		});
	}

	showConfirm(args: {
		title: string;
		content: string;
		okText: string;
		cancelText: string;
	}) {
		return this.#postMessageUtil(LISTENER_CMDS.CONFIRM, {
			data: {
				title: args.title,
				content: args.content,
				okText: args.okText || "Ok",
				cancelText: args.cancelText || "Cancel"
			}
		});
	}

	redirect(url: string, shouldConfirm: any) {
		return this.#postMessageUtil(LISTENER_CMDS.REDIRECT, { url });
	}

	#addListener(_id: string, callback: any) {
		this.#listeners[_id] = this.#listeners[_id] || [];
		this.#listeners[_id].push(callback);
	}

	#postMessageUtil(command: string, args: any) {
		return new Promise((resolve, reject) => {
			const _id = generateId(Object.keys(this.#listeners)?.length ?? 100);
			postMessage({ _id, command, ...args });
			this.#addListener(_id, (data: any) => {
				if (data.errorMessage) {
					reject(data);
				} else {
					resolve(data);
				}
			});
		});
	}

	#onMessage(event: any) {
		console.log(
			"SDK : @onMessage",
			event.origin,
			"!==",
			self.location.origin
		);
		if (event.origin !== self.location.origin) {
			console.log("SDK : @onMessage ", event);
			const data = event.data;
			const _req = data._req || {};
			let listeners = this.#listeners[_req._id] || [];
			if (listeners) {
				listeners.forEach((listener: any) => {
					try {
						listener(data);
					} catch (err) {
						console.error("Message callback error: ", err);
					}
				});
			}
		}
	}
}

class ProcessSdk extends LcncSdk {}

function initSDK(config: any = {}) {
	if (config.flow === "Process") {
		return new ProcessSdk(config);
	}
	return new LcncSdk(config);
}

export default initSDK;
