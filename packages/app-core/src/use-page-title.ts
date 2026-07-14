import { useContext, useEffect } from "react";

import { PageTitleContext } from "./layout-context";

/**
 * Read or set the title the root layout displays.
 *  - In a page: `usePageTitle("Contacts")` sets the current title.
 *  - In a layout: `const title = usePageTitle()` reads it.
 *
 * Setting the title also updates `document.title`. Because the layout is
 * persistent, the page can change the header without the shell remounting.
 */
export function usePageTitle(title?: string): string {
  const { title: current, setTitle } = useContext(PageTitleContext);

  useEffect(
    function syncTitle() {
      if (title === undefined) return;
      setTitle(title);
      if (typeof document !== "undefined") document.title = title;
    },
    [title, setTitle],
  );

  return current;
}
