import { BaseSDK } from "./base.js";
import { LISTENER_CMDS } from "./constants.js";
export class Client extends BaseSDK {
    showInfo(message) {
        return super._postMessageAsync(LISTENER_CMDS.MESSAGE, { message });
    }
    showConfirm(args) {
        return super._postMessageAsync(LISTENER_CMDS.CONFIRM, {
            data: {
                title: args.title,
                content: args.content,
                okText: args.okText || "Ok",
                cancelText: args.cancelText || "Cancel"
            }
        });
    }
}
