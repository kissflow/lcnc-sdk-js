import { useState } from "react";

// Slightly above the host scanner's own 180s inactivity auto-close, so the
// host always settles first when it is able to.
const SCAN_TIMEOUT_MS = 200000;

/**
 * Shared scan invocation for ScannerField / TableScannerField.
 * `scan(field)` opens the host's scanner modal and resolves with the decoded
 * string, or `null` when the user closes without scanning (or on failure —
 * the failure message is exposed via `scanError`).
 */
export function useScanner() {
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);

  const scan = async (field) => {
    if (scanning || !window.kf?.client?.openScanner) return null;
    setScanning(true);
    setScanError(null);
    try {
      const result = await Promise.race([
        window.kf.client.openScanner({
          localFileScan: Boolean(field.ScanFromStorage)
        }),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Scanner timed out")),
            SCAN_TIMEOUT_MS
          )
        )
      ]);
      return typeof result === "string" && result ? result : null;
    } catch (err) {
      setScanError(err?.message || err?.error || "Scanning failed");
      return null;
    } finally {
      setScanning(false);
    }
  };

  return { scanning, scanError, scan };
}
