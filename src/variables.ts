import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Variables extends BaseSDK {
	get(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_VARIABLE, {
			key
		});
	}

	set(key: string, value: any) {
		return this._postMessageAsync(LISTENER_CMDS.SET_VARIABLE, {
			key,
			value
		});
	}
}
