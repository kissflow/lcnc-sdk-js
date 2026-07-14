import { useNavigate } from "react-router-dom";

export { Link as KfLink } from "react-router-dom";

export interface KfRouter {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  forward: () => void;
}

/**
 * Programmatic navigation inside a Kissflow App UI. Route changes are mirrored
 * to the parent Kissflow URL automatically by <RouteSync> — no SDK calls needed.
 */
export function useKfRouter(): KfRouter {
  const navigate = useNavigate();
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
  };
}
