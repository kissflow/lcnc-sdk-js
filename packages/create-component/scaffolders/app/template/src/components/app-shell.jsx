import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useKf, usePageTitle } from "@sooryakanth/app-ui";
import { LayoutDashboard, PanelsTopLeft, Moon, Sun, Palette, Check, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { THEMES, applyTheme, getTheme } from "../themes.js";

// Root layout (passed to <KfApp layout={AppShell} />). Renders ONCE and stays
// mounted across navigation — the sidebar keeps its state, only `children`
// (the matched route) swaps. Pages set the header via usePageTitle("…").
//
// Responsive: the sidebar is a fixed rail on md+ and an off-canvas drawer
// (hamburger in the header) on mobile. Design it for the app you're building —
// edit NAV_ITEMS, the brand, and the layout. Style with Tailwind + shadcn tokens.
const NAV_ITEMS = [{ to: "/", label: "Dashboard", end: true, icon: LayoutDashboard }];

function initials(name = "") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);
  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  }
  return [dark, toggle];
}

function ThemeSwitcher() {
  const [theme, setTheme] = useState(getTheme);
  const active = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
          <Palette className="size-4" />
          <span className="flex-1 text-left">Theme</span>
          <span className="size-3.5 rounded-full ring-1 ring-border" style={{ background: active.swatch }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-52">
        <DropdownMenuLabel>Accent</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {THEMES.map((t) => (
          <DropdownMenuItem key={t.id} onSelect={() => setTheme(applyTheme(t.id))} className="gap-2">
            <span className="size-3.5 rounded-full ring-1 ring-border" style={{ background: t.swatch }} />
            <span className="flex-1">{t.label}</span>
            {t.id === theme && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Sidebar contents, reused by the desktop rail and the mobile drawer.
function SidebarBody({ dark, toggleDark, onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-1 p-3 text-sidebar-foreground">
      <div className="flex items-center gap-2 px-2 py-3 font-semibold">
        <span className="grid size-8 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <PanelsTopLeft className="size-4" />
        </span>
        App UI
      </div>

      <nav className="mt-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-1">
        <ThemeSwitcher />
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={toggleDark}>
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {dark ? "Light mode" : "Dark mode"}
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }) {
  const kf = useKf();
  const title = usePageTitle();
  const [dark, toggleDark] = useDarkMode();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop rail */}
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:flex">
        <SidebarBody dark={dark} toggleDark={toggleDark} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 md:px-6">
          {/* Mobile drawer */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBody dark={dark} toggleDark={toggleDark} onNavigate={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
            {title || "Dashboard"}
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{kf.user?.Name ?? "Signed in"}</span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {initials(kf.user?.Name) || "•"}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
