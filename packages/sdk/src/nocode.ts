import { BaseSDK } from "./core";

import { Form, TableForm } from "./form";
import { Client, Formatter } from "./utils";
import { window } from "./window";

import { SDKContext } from "./types/internal";
import { userObject, accountObject, FetchOptions } from "./types/external";

class NocodeSDK extends BaseSDK {
	context: Form | TableForm;
	client: Client;
	formatter: Formatter;
	user: userObject;
	account: accountObject;
	eventParameters: any;
	#csrfToken: string;

	constructor(props: SDKContext) {
		super();
		if (props.tableId && props.tableRowId) {
			this.context = new TableForm(
				props.formInstanceId,
				props.tableId,
				props.tableRowId
			);
		} else if (props.formInstanceId) {
			this.context = new Form(props.formInstanceId);
		}
		this.client = new Client();
		this.formatter = new Formatter();
		this.user = props.user;
		this.account = props.account;
		this.#csrfToken = props.csrfToken;
	}
	async api(
		url: string,
		args?: FetchOptions
	) {
		const response = await globalThis.fetch(url, {
			...args,
			headers: {
				...(args?.headers || {}),
				"X-Csrf-Token": this.#csrfToken
			}
		});
		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			return await response.json();
		} else {
			return response;
		}
	}
}

function initSDK(config: SDKContext): NocodeSDK {
	return new NocodeSDK(config);
}

export { window, initSDK as default };
