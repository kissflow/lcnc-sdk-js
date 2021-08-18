import { BaseSDK } from "./base.js";
import { LISTENER_CMDS } from "./constants.js";

export class Client extends BaseSDK {
	showInfo(message: string) {
		return super._postMessagePromise(LISTENER_CMDS.MESSAGE, { message });
	}

	showConfirm(args: {
		title: string;
		content: string;
		okText: string;
		cancelText: string;
	}) {
		return super._postMessagePromise(LISTENER_CMDS.CONFIRM, {
			data: {
				title: args.title,
				content: args.content,
				okText: args.okText || "Ok",
				cancelText: args.cancelText || "Cancel"
			}
		});
	}
}
