import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Client extends BaseSDK {
	showInfo(message: string) {
		return super._postMessageAsync(LISTENER_CMDS.MESSAGE, { message });
	}

	showConfirm(args: {
		title: string;
		content: string;
		okText: string;
		cancelText: string;
	}) {
		return super._postMessageAsync(LISTENER_CMDS.CONFIRM, {
			data: {
				title: args.title,
				content: args.content,
				okText: args.okText || "Ok",
				cancelText: args.cancelText || "Cancel"
			}
		});
	}

	redirect(url) {
		return super._postMessageAsync(LISTENER_CMDS.REDIRECT, { url });
	}
}
