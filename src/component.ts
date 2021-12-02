import { BaseSDK } from "./base";
import { LISTENER_CMDS } from "./constants";

export class Component extends BaseSDK {
	id: string;
	constructor(id: string) {
    super({});
		this.id = id;
	}
	refresh() {
		return this._postMessageAsync(LISTENER_CMDS.COMPONENT_REFRESH, {
			id: this.id
		});
	}
}
