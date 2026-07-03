import { userObject, accountObject, environmentObject } from "./external";

export interface SDKContext {
    formInstanceId: string;
    flowId: string;
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
    initialRoute?: string;
}

export interface PopupContext {
    popupId?: string;
}

export interface FilePickerOptions {
    fileExtensions?: string[];
    maxSize?: number;
    maxCount?: number;
    imageProps?: {
        sizes?: Array<[number, number]>;
        crop?: boolean;
    };
}

/** Minimal shape of a browser File/Blob object, avoids requiring the DOM lib. */
export interface UploadableFile {
    name: string;
    size?: number;
    type?: string;
}
