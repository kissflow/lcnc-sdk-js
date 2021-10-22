import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Application extends BaseSDK {
	getVariable(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_APP_VARIABLE, {
			key
		});
	}

	setVariable(key: string, value: any) {
		return this._postMessageAsync(LISTENER_CMDS.SET_APP_VARIABLE, {
			key,
			value
		});
	}
}
