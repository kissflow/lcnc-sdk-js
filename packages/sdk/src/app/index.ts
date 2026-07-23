import { BaseSDK, LISTENER_CMDS } from "../core";
import { CreateProxy } from "../core/proxy";

import { Page } from "./page";

import { AppContext } from "../types/internal";
import { rolesObject } from "../types/external";

import { DecisionTable } from "./decisiontable";
import { Dataform, CustomComponentDataform } from "../dataform";
import { Board, CustomComponentBoard } from "../board";
import { Process, CustomComponentProcess } from "../process";

export class Application extends BaseSDK {
	page: Page;
	// variable: AppVariable;
	_id: string;

	constructor(props: AppContext, isCustomComponent: boolean = false) {
		super();
		this._id = props.appId;
		this.page = new Page(props);
		// /* Note: Synchronous variable read/write is not supported for custom components
		//  * as it is not possible to use Atomics.wait in the main thread and iframe thread
		//  */
		// !isCustomComponent && (this.variable = new AppVariable());
	}
	getVariable(key: string) {
		return this._postMessageAsync(LISTENER_CMDS.GET_APP_VARIABLE, {
			key
		});
	}

	setVariable(key: string | object, value?: any) {
		return this._postMessageAsync(LISTENER_CMDS.SET_APP_VARIABLE, {
			key,
			value
		});
	}

	openPage(pageId: string, pageParams?: object) {
		return this._postMessageAsync(LISTENER_CMDS.OPEN_PAGE, {
			pageId,
			pageParams
		});
	}

	getDecisionTable(flowId: string): DecisionTable {
		return new DecisionTable(flowId);
	}

	getDataform(flowId: string): Dataform {
		return new Dataform(flowId);
	}

	getBoard(flowId: string): Board {
		return new Board(flowId);
	}

	getProcess(flowId: string): Process {
		return new Process(flowId);
	}

	/**
	 * List the app's roles and which of them the current user is a member of.
	 *
	 * Only available in a Development account - use this to build a role
	 * picker UI inside the component, then pass the chosen role to
	 * {@link switchRole}.
	 *
	 * @returns A promise that resolves with `{ roles, currentRoles }` - the
	 * full list of app roles and the subset the current user belongs to.
	 *
	 * @example
	 * const { roles, currentRoles } = await kf.app.getRoles();
	 */
	getRoles(): Promise<{ roles: rolesObject[]; currentRoles: rolesObject[] }> {
		return this._postMessageAsync(LISTENER_CMDS.GET_ROLES, {}) as Promise<{
			roles: rolesObject[];
			currentRoles: rolesObject[];
		}>;
	}

	/**
	 * Switch the current user's active role in a Development account.
	 *
	 * This performs a real role change - it removes the user from their
	 * current role(s) and adds them to the target role. The platform's app
	 * shell (top nav, other widgets) picks up the new role on its own; no
	 * page reload happens. Only available in a Development account.
	 *
	 * @param args - Either `roleId` or `roleName` identifying the target role
	 * (use the values returned by {@link getRoles}).
	 * @returns A promise that resolves with the switched-to role.
	 *
	 * @example
	 * const { roles } = await kf.app.getRoles();
	 * await kf.app.switchRole({ roleId: roles[1]._id });
	 */
	switchRole(args: { roleId?: string; roleName?: string }) {
		return this._postMessageAsync(LISTENER_CMDS.SWITCH_ROLE, {
			roleId: args.roleId,
			roleName: args.roleName
		}) as Promise<rolesObject>;
	}
}

/**
 * Application with custom-component-only capabilities.
 *
 * Used by the custom-component SDK (`kf.app`). Its flow accessors return the
 * `CustomComponent*` variants, which expose `initForm` — a method that the
 * Low/No-code (Run Script) SDKs deliberately do not have.
 */
export class CustomComponentApplication extends Application {
	getDataform(flowId: string): CustomComponentDataform {
		return new CustomComponentDataform(flowId);
	}

	getBoard(flowId: string): CustomComponentBoard {
		return new CustomComponentBoard(flowId);
	}

	getProcess(flowId: string): CustomComponentProcess {
		return new CustomComponentProcess(flowId);
	}
}


class AppVariable extends BaseSDK {
	constructor() {
		super()
		return new CreateProxy(this)
	}

	get(key, path) {
		let args = {
			key,
			path: path
		}
		return this._postMessageSync(LISTENER_CMDS.GET_APP_VARIABLE, args);
	}

	set(key, value, path) {
		let args = {
			key,
			value,
			path
		}
		return this._postMessageSync(LISTENER_CMDS.SET_APP_VARIABLE, args);
	}
}

export * from "./component";
export { Page };
export * from "./popup";
