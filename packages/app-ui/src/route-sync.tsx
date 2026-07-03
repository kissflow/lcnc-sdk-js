import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useKf } from "./use-kf";

const toPath = (route: string) => "/" + (route || "").replace(/^\//, "");
const toSlug = (pathname: string) => pathname.replace(/^\//, "");

/**
 * Keeps the in-iframe MemoryRouter and the parent Kissflow URL in sync:
 *  - seeds the router from the deep-link route the host opened us with,
 *  - applies host-driven route changes (parent back/forward/deep-link),
 *  - mirrors local navigation up to the parent URL.
 * Rendered once near the router root by <KfApp>. Loop-guarded so a host push
 * is never echoed back to the host.
 */
export function RouteSync() {
  const kf = useKf();
  const navigate = useNavigate();
  const location = useLocation();
  // Last path applied from a host-driven change — so we don't echo it back up.
  const fromHostRef = useRef<string | null>(null);
  const initedRef = useRef(false);
  // react-router's `navigate` changes identity on every location change, so we
  // read it through a ref to keep effects from re-running (which would re-seed
  // the route and re-subscribe on every navigation).
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(
    function initRouteSync() {
      if (initedRef.current) return;
      initedRef.current = true;

      const initial = toPath(kf.app.page.getRoute());
      fromHostRef.current = initial;
      navigateRef.current(initial, { replace: true });

      kf.context.watchRoute(({ route }) => {
        const path = toPath(route);
        fromHostRef.current = path;
        navigateRef.current(path);
      });
    },
    [kf],
  );

  useEffect(
    function pushRouteToHost() {
      if (location.pathname === fromHostRef.current) return;
      kf.app.page.setRoute(toSlug(location.pathname));
    },
    [kf, location.pathname],
  );

  return null;
}
