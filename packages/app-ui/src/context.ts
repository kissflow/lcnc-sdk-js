import { createContext } from "react";

import type KFSDK from "@abdul-kissflow/lowcode-client-sdk";

/** The initialized Kissflow SDK instance (`kf`). */
export type KfInstance = Awaited<ReturnType<typeof KFSDK.initialize>>;

export interface KfContextValue {
    kf: KfInstance | null;
    ready: boolean;
    error: boolean;
}

export const KfContext = createContext<KfContextValue>({
    kf: null,
    ready: false,
    error: false
});
