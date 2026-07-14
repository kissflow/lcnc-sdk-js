import { useEffect, useMemo, useState } from "react";
import KFSDK from "@kissflow/lowcode-client-sdk";

import { KfContext } from "./context";

import type { KfContextValue, KfInstance } from "./context";
import type { ReactNode } from "react";

// SDK-only, frame-aware: the app runs ONLY inside Kissflow, against the real SDK.

interface KfProviderProps {
    children: ReactNode;
    /** Rendered while the SDK initializes. Defaults to null. */
    loader?: ReactNode;
    /** Rendered when not running inside Kissflow (or the SDK fails to init). */
    fallback?: ReactNode;
}

type Mode = "init" | "online" | "error";

// The custom UI always runs framed inside Kissflow. Opened top-level (e.g. the dev
// URL directly in a tab) means we're NOT inside Kissflow, so we don't even try to
// init — `KFSDK.initialize()` would just hang forever there.
function insideKissflow(): boolean {
    try {
        return typeof window !== "undefined" && window.self !== window.top;
    } catch {
        // Cross-origin access to window.top throws → we're framed (inside Kissflow).
        return true;
    }
}

/**
 * Initializes the Kissflow SDK once and exposes it via context (and `window.kf`).
 * Inside Kissflow it waits for the real SDK (no timeout race — a slow handshake no
 * longer drops the app into a dev fallback). Outside Kissflow it shows `fallback`.
 */
export function KfProvider({
    children,
    loader = null,
    fallback
}: KfProviderProps) {
    const [mode, setMode] = useState<Mode>("init");
    const [sdk, setSdk] = useState<KfInstance | null>(null);

    useEffect(function initSdk() {
        let cancelled = false;

        if (!insideKissflow()) {
            setMode("error");
            return;
        }

        KFSDK.initialize()
            .then((s) => {
                if (cancelled) return;
                (window as unknown as { kf: unknown }).kf = s;
                setSdk(s as KfInstance);
                setMode("online");
            })
            .catch(() => {
                if (!cancelled) setMode("error");
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const value = useMemo<KfContextValue>(
        () => ({ kf: sdk, ready: mode === "online", error: mode === "error" }),
        [sdk, mode]
    );

    if (mode === "init") return <>{loader}</>;
    if (mode === "error") {
        return (
            <>{fallback ?? <div>Please open this app inside Kissflow.</div>}</>
        );
    }

    return <KfContext.Provider value={value}>{children}</KfContext.Provider>;
}
