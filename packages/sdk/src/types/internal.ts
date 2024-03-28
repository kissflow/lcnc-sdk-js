import { userObject, accountObject, environmentObject } from "./external";

export interface SDKContext {
	formInstanceId: string;
	tableId: string;
	tableRowId: string;
	componentId: string;
	componentMethods?: componentMethodsType[];
	appId: string;
	pageId: string;
	popupId: string;
	user: userObject;
	account: accountObject;
	csrfToken: string;
	envDetails: environmentObject;
}

export interface componentMethodsType {
	name: string;
	returnType?: string;
	parameters?: string[];
}

export interface ComponentProps {
	componentId: string;
	componentMethods?: componentMethodsType[];
}

export interface AppContext {
	appId: string;
	pageId: string;
}

export interface PageContext {
	pageId: string;
}

export interface PopupContext {
	popupId?: string;
}
