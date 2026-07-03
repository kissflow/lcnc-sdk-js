import { Suspense, useMemo, useState } from "react";
import { MemoryRouter, useRoutes } from "react-router-dom";

import { PageTitleContext } from "./layout-context";
import { KfProvider } from "./provider";
import { RouteSync } from "./route-sync";

import type { ComponentType, ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import type { KfSchema } from "./offline/schema";

interface KfAppProps {
  /** Route table — typically `import routes from "~react-pages"`. */
  routes: Array<RouteObject>;
  /**
   * Persistent root layout wrapping every route — the equivalent of Next's
   * `app/layout.tsx`. Receives the matched route as `children`. It renders once
   * and stays mounted across navigation, so a shared shell (sidebar, header…)
   * keeps its state. Pages drive its title via `usePageTitle("…")`.
   */
  layout?: ComponentType<{ children: ReactNode }>;
  loader?: ReactNode;
  fallback?: ReactNode;
  /**
   * Synced app schema (`import schema from "./lib/kf-schema.json"`). Enables
   * offline dev mode: outside Kissflow the app boots against a mock seeded from
   * this schema, with a role switcher. Ignored in production / inside Kissflow.
   */
  devSchema?: KfSchema;
}

function RoutedApp({ routes }: { routes: Array<RouteObject> }) {
  return useRoutes(routes);
}

function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("");
  const value = useMemo(() => ({ title, setTitle }), [title]);
  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  );
}

/**
 * Root of a Kissflow App UI. Boots the SDK, sets up the in-iframe router, keeps
 * routes in sync with the parent Kissflow URL, and (optionally) wraps everything
 * in a persistent `layout`.
 *
 * ```tsx
 * import routes from "~react-pages";
 * import { AppShell } from "./components/app-shell";
 * createRoot(el).render(<KfApp routes={routes} layout={AppShell} />);
 * ```
 */
export function KfApp({ routes, layout: Layout, loader, fallback, devSchema }: KfAppProps) {
  const content = (
    <Suspense fallback={loader ?? null}>
      <RoutedApp routes={routes} />
    </Suspense>
  );

  return (
    <KfProvider loader={loader} fallback={fallback} devSchema={devSchema}>
      <PageTitleProvider>
        <MemoryRouter>
          <RouteSync />
          {Layout ? <Layout>{content}</Layout> : content}
        </MemoryRouter>
      </PageTitleProvider>
    </KfProvider>
  );
}
