// The published @kissflow/lowcode-client-sdk ships bundled *ambient* typings
// (its default export lives in an internal `declare module "index"` block), so
// `import KFSDK from "@kissflow/lowcode-client-sdk"` isn't consumable as a module
// by TypeScript. This shim declares the surface the framework relies on.
// (Follow-up: have the SDK build emit a proper module entry `.d.ts`.)
declare module "@kissflow/lowcode-client-sdk" {
    interface KfPage {
        setRoute(path: string): void;
        getRoute(): string;
        getParameter(key: string): Promise<unknown>;
        getAllParameters(): Promise<unknown>;
        getVariable(key: string): Promise<unknown>;
        setVariable(
            key: string | Record<string, unknown>,
            value?: unknown
        ): Promise<unknown>;
        openPopup(popupId: string, params?: object): Promise<unknown>;
    }

    interface KfApplication {
        page: KfPage;
        openPage(pageId: string, params?: object): Promise<unknown>;
        getVariable(key: string): Promise<unknown>;
        setVariable(
            key: string | Record<string, unknown>,
            value?: unknown
        ): Promise<unknown>;
    }

    interface KfContextApi {
        watchParams(cb: (data: unknown) => void): void;
        watchRoute(cb: (data: { route: string }) => void): void;
    }

    interface KfUser {
        _id: string;
        Name: string;
        Email: string;
        [key: string]: unknown;
    }

    interface KfAccount {
        _id: string;
        [key: string]: unknown;
    }

    interface KfSDK {
        app: KfApplication;
        context: KfContextApi;
        user: KfUser;
        account: KfAccount;
        api(url: string, args?: object): Promise<unknown>;
        initialize(): Promise<KfSDK>;
    }

    const kf: KfSDK;
    export default kf;
}
