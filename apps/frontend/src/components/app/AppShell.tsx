import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  Command,
  GitCompareArrows,
  Grid2X2,
  Library,
  Orbit,
  PanelLeft,
  Search,
  type LucideIcon
} from "lucide-react";
import type { ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
  contentClassName?: string;
};

type AppNavTarget = "/search" | "/collections" | "/comparator";

type AppNavLinkProps = {
  to: AppNavTarget;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
};

const isRouteActive = (pathname: string, target: AppNavTarget): boolean =>
  pathname === target || pathname.startsWith(`${target}/`);

export function AppShell({ children, contentClassName }: AppShellProps) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname
  });

  return (
    <div className="min-h-screen bg-space-void text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-space-shell/95 backdrop-blur-xl">
        <div className="grid h-14 grid-cols-[auto_1fr_auto] items-center gap-4 px-4">
          <div className="flex min-w-0 items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden h-9 w-9 text-muted-foreground hover:bg-white/5 hover:text-foreground lg:inline-flex"
              aria-label="Toggle navigation"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
            <Link to="/search" className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-space-orange/30 bg-space-orange/10 text-space-orange">
                <Orbit className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-semibold leading-4 tracking-normal text-white">Cosmara</span>
                <span className="block text-[10px] font-medium uppercase tracking-normal text-muted-foreground">
                  AI Space Archive
                </span>
              </span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
              <AppNavLink
                to="/search"
                label="Explore"
                icon={Grid2X2}
                isActive={isRouteActive(pathname, "/search")}
              />
              <AppNavLink
                to="/collections"
                label="Collections"
                icon={Library}
                isActive={isRouteActive(pathname, "/collections")}
              />
              <AppNavLink
                to="/comparator"
                label="Compare"
                icon={GitCompareArrows}
                isActive={isRouteActive(pathname, "/comparator")}
              />
            </nav>
          </div>
          <ShellSearchField />
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-space-panel px-2 pr-3 text-left text-sm text-foreground shadow-sm shadow-black/20 transition-colors hover:bg-space-panelStrong"
            >
              <Avatar className="h-7 w-7 border border-space-orange/30">
                <AvatarFallback className="bg-space-orange text-xs font-semibold text-space-void">AV</AvatarFallback>
              </Avatar>
              <span className="hidden font-medium sm:inline">Aman Verma</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>
      <main className={cn("min-h-[calc(100vh-3.5rem)]", contentClassName)}>{children}</main>
    </div>
  );
}

function AppNavLink({ to, label, icon: Icon, isActive }: AppNavLinkProps) {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "h-9 rounded-md px-3 text-muted-foreground hover:bg-white/5 hover:text-white",
        isActive && "bg-white/10 text-white hover:bg-white/10"
      )}
    >
      <Link to={to}>
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    </Button>
  );
}

function ShellSearchField() {
  return (
    <div className="mx-auto hidden w-full max-w-[420px] items-center md:flex">
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search NASA imagery..."
          className="h-9 rounded-full border-white/10 bg-space-void/60 pl-10 pr-12 text-sm text-foreground shadow-inner shadow-black/20 placeholder:text-muted-foreground focus-visible:ring-space-cyan/70"
        />
        <span className="pointer-events-none absolute right-2 top-1/2 inline-flex h-5 -translate-y-1/2 items-center gap-1 rounded border border-white/10 bg-space-panel px-1.5 text-[10px] text-muted-foreground">
          <Command className="h-3 w-3" />K
        </span>
      </div>
    </div>
  );
}
