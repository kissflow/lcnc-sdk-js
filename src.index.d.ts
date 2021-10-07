declare module "base" {
    export class BaseSDK {
        #private;
        constructor(props: any);
        _postMessageAsync(command: string, args: any, hasCallBack?: boolean, callBack?: (data: any) => {}): Promise<unknown>;
        _postMessage(command: string, func: (data: any) => {}, args?: {}): void;
    }
}
declare module "constants" {
    export const LISTENER_CMDS: {
        API: string;
        PARAMS: string;
        ACCOUNT_CONTEXT: string;
        GET_TABLE_DETAILS: string;
        GET_FORM_FIELD: string;
        GET_FORM_TABLE_FIELD: string;
        UPDATE_FORM: string;
        UPDATE_FORM_TABLE: string;
        MESSAGE: string;
        CONFIRM: string;
        ALERT: string;
        REDIRECT: string;
        OPEN_PAGE: string;
        FORMAT_DATE: string;
        FORMAT_DATE_TIME: string;
        FORMAT_NUMBER: string;
        FORMAT_CURRENCY: string;
        FORMAT_BOOLEAN: string;
        GET_VARIABLE: string;
        SET_VARIABLE: string;
        RETURN: string;
    };
}
declare module "client" {
    import { BaseSDK } from "base";
    export class Client extends BaseSDK {
        showInfo(message: string): Promise<unknown>;
        showConfirm(args: {
            title: string;
            content: string;
            okText: string;
            cancelText: string;
        }): Promise<unknown>;
        redirect(url: any): Promise<unknown>;
        openPage(pageId: any): Promise<unknown>;
    }
}
declare module "form" {
    import { BaseSDK } from "base";
    export class Form extends BaseSDK {
        getField(fieldId: string): Promise<unknown>;
        updateField(args?: {}): Promise<unknown>;
    }
}
declare module "formatter" {
    import { BaseSDK } from "base";
    export class Formatter extends BaseSDK {
        toKfDate(date: string): Promise<unknown>;
        toKfDateTime(date: string): Promise<unknown>;
        toKfNumber(value: string): Promise<unknown>;
        toKfCurrency(value: string, currencyCode: string): Promise<unknown>;
        toBoolean(value: string): Promise<unknown>;
    }
}
declare module "variables" {
    import { BaseSDK } from "base";
    export class Variables extends BaseSDK {
        get(key: string): Promise<unknown>;
        set(key: string, value: any): Promise<unknown>;
    }
}
declare module "lcnc.sdk" {
    import { BaseSDK } from "base";
    import { Form } from "form";
    import { Client } from "client";
    import { Formatter } from "formatter";
    import { Variables } from "variables";
    export class LcncSDK extends BaseSDK {
        currentForm: Form;
        client: Client;
        formatter: Formatter;
        variables: Variables;
        constructor(props: any);
        api(url: string, args?: {}): Promise<unknown>;
        watchParams(func: (data: any) => any): void;
        getAccountContext(): Promise<unknown>;
        redirect(url: string, shouldConfirm: any): Promise<unknown>;
    }
    function initSDK(config?: any): LcncSDK;
    export default initSDK;
}
