import { useContext } from "react";

import { KfContext } from "./context";

import type { KfInstance } from "./context";

/** Returns the initialized Kissflow SDK instance. Throws if used before ready. */
export function useKf(): KfInstance {
  const { kf } = useContext(KfContext);
  if (!kf) {
    throw new Error(
      "useKf() must be called inside <KfApp>/<KfProvider> after the SDK is ready.",
    );
  }
  return kf;
}

/** Whether the SDK has finished initializing. */
export function useKfReady(): boolean {
  return useContext(KfContext).ready;
}
