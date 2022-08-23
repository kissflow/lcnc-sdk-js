import { userObject, accountObject } from "./external";

export interface SDKContext {
	formInstanceId: string;
	tableId: string;
	tableRowId: string;
	componentId: string;
	manifestMethods?: manifestMethodsType[];
	appId: string;
	pageId: string;
	popupId: string;
	user: userObject;
	account: accountObject;
}

export interface manifestMethodsType {
	name: string;
	returnType?: string;
	parameters?: string[];
}

export interface ComponentProps {
	componentId: string;
	pageId: string;
	manifestMethods?: manifestMethodsType[];
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