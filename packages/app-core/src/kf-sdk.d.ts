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

    interface KfAgentExecution {
        ExecutionId: string;
        Status: "Queued" | "NotStarted" | "Running" | "Completed" | "Failed";
        Output?: { items: Array<Record<string, string | number | boolean>> };
        Error?: { Code: string; Retryable: boolean; Details?: unknown };
        [key: string]: unknown;
    }

    interface KfAgentError {
        isError: true;
        error?: string;
        errorCode?: string;
    }

    /** A published Custom Agent of the app (`kf.app.getAgent(agentId)`). */
    interface KfAgent {
        getContract(): Promise<{
            AgentId: string;
            Definition: {
                Name: string;
                Inputs: Array<{ Key: string; Name: string; DataType: string; Required: boolean }>;
                Outputs: Array<{ Key: string; Name: string; DataType: string }>;
                MaxOutputItems: number;
                [key: string]: unknown;
            };
            Readiness: { Ready: boolean; Issues: unknown[] };
        }>;
        execute(options: {
            inputData: Record<string, unknown>;
        }): Promise<{ ExecutionId: string; Status: KfAgentExecution["Status"] }>;
        getExecution(executionId: string): Promise<KfAgentExecution>;
        onExecutionComplete(
            executionId: string,
            onComplete: (execution: KfAgentExecution) => void,
            onWatchError?: (error: KfAgentError) => void
        ): () => void;
    }

    interface KfApplication {
        page: KfPage;
        getAgent(agentId: string): KfAgent;
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
