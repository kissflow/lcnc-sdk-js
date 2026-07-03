import { createContext, useContext } from "react";

import type { KfSchema } from "./schema";

/**
 * Dev-mode info for offline/live runs: the simulated role and a helper to check
 * whether that role can access a given model (from the synced `roleAccess`). Outside
 * dev mode (real Kissflow), `active` is false and `canAccess` returns true for all.
 */
export interface KfDevValue {
  active: boolean;
  mode: "offline" | "live" | null;
  roleId: string | null;
  roleName: string | null;
  schema: KfSchema | null;
  /** Can the active role use this model? Always true outside dev mode. */
  canAccess: (modelId: string) => boolean;
}

const DEFAULT: KfDevValue = {
  active: false,
  mode: null,
  roleId: null,
  roleName: null,
  schema: null,
  canAccess: () => true,
};

export const KfDevContext = createContext<KfDevValue>(DEFAULT);

/**
 * Dev role state. Use `canAccess(modelId)` to gate UI by the simulated role:
 *
 *   const { active, roleName, canAccess } = useKfDev();
 *   if (active && !canAccess(FORM_ID)) return <NoAccess role={roleName} />;
 */
export function useKfDev(): KfDevValue {
  return useContext(KfDevContext);
}

/** Build a `canAccess` checker from a schema + the active role id. */
export function makeCanAccess(schema: KfSchema | null, roleId: string | null) {
  return (modelId: string): boolean => {
    if (!schema || !roleId) return true;
    const model = schema.dataModels.find((m) => m.id === modelId);
    // No access info synced → don't block (fail open).
    if (!model || !model.roleAccess || model.roleAccess.length === 0) return true;
    return model.roleAccess.some((r) => r.id === roleId);
  };
}
