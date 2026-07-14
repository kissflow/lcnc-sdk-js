import { useState } from "react";

// Slightly above the host's own picker having no built-in timeout — this is
// purely a safety net against a stale/unresponsive host.
const PICK_TIMEOUT_MS = 200000;

/**
 * Shared pick invocation for GeolocationField / TableGeolocationField.
 * `pick(value)` opens the host's native Geolocation map picker (search,
 * current-location, marker drag, reverse-geocode) and resolves with the
 * picked location object, or `null` when the user closes without picking
 * (or on failure — the failure message is exposed via `pickError`).
 */
export function useGeolocationPicker() {
  const [picking, setPicking] = useState(false);
  const [pickError, setPickError] = useState(null);

  const pick = async (value) => {
    if (picking || !window.kf?.client?.pickLocation) return null;
    setPicking(true);
    setPickError(null);
    try {
      const result = await Promise.race([
        window.kf.client.pickLocation(value || undefined),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Location picker timed out")),
            PICK_TIMEOUT_MS
          )
        )
      ]);
      return result || null;
    } catch (err) {
      setPickError(err?.message || err?.error || "Failed to pick location");
      return null;
    } finally {
      setPicking(false);
    }
  };

  return { picking, pickError, pick };
}
