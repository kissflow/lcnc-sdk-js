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

export class BaseSDK {
	#listeners: any;
	constructor(props: any) {
		console.log("SDK : Initializing ", props);
		this.#listeners = {};
		self.addEventListener("message", this.#onMessage.bind(this), false);
	}

	#addListener(_id: string, callback: any) {
		this.#listeners[_id] = this.#listeners[_id] || [];
		this.#listeners[_id].push(callback);
	}

	_postMessageAsync(
		command: string,
		args: any,
		hasCallBack?: boolean,
		callBack?: (data: any) => {}
	) {
		return new Promise((resolve, reject) => {
			const _id = generateId(Object.keys(this.#listeners)?.length ?? 100);
			postMessage({ _id, command, ...args });
			this.#addListener(_id, async (data: any) => {
				if (data.errorMessage) {
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

	_postMessage(
		command: string,
		func: (data: any) => {},
		args = {}
	) {
		const _id = generateId(Object.keys(this.#listeners)?.length ?? 100);
		postMessage({ _id, command, ...args });
		this.#addListener(_id, (data: any) => func(data));
	}

	#onMessage(event: any) {
		if (event.origin !== self.location.origin) {
			console.log("SDK : @onMessage ", event);
			const data = event.data;
			const _req = data?._req || {};
			let listeners = this.#listeners[_req?._id] || [];
			if (listeners) {
				listeners.forEach((listener: any) => {
					try {
						listener(data.resp);
					} catch (err) {
						console.error("Message callback error: ", err);
					}
				});
			}
		}
	}
}
