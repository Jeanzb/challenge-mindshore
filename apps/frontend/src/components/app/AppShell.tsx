import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  GitCompareArrows,
  Grid2X2,
  Library,
  LogOut,
  Orbit,
  Search,
  type LucideIcon
} from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AppToaster } from "@/components/app/AppToaster";
import { defaultNasaSearchQuery } from "@/constants";
import { useAuthSession } from "@/hooks/auth";
import { useUiStore, uiSelectors } from "@/store";
import { cn } from "@/lib/utils";
import { fallbackExplorerName, getUserDisplayName, getUserInitials } from "@/lib/userProfile";

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
            <Link to="/search" className="flex min-w-0 items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-space-orange/30 bg-space-orange/10 text-space-orange">
                <Orbit className="h-5 w-5" />
              </span>
              <span className="hidden min-w-0 sm:block">
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
          <div className="flex items-center gap-2 justify-end">
            <MobileSearchLink />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className={cn("min-h-[calc(100vh-3.5rem)] pb-14 md:pb-0", contentClassName)}>{children}</main>
      <MobileBottomNav pathname={pathname} />
      <AppToaster />
    </div>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthSession();
  const displayName = getUserDisplayName(user);
  const initials = getUserInitials(user);

  const handleLogout = () => {
    logout();
    void navigate({ to: "/auth" });
  };

  if (!isAuthenticated) {
    return (
      <Button
        asChild
        variant="ghost"
        className="h-10 rounded-full border border-white/10 bg-space-panel px-2 pr-3 text-sm text-foreground shadow-sm shadow-black/20 hover:bg-space-panelStrong hover:text-white"
      >
        <Link to="/auth">
          <Avatar className="h-7 w-7 border border-space-orange/30">
            <AvatarFallback className="bg-space-orange text-xs font-semibold text-space-void">KJ</AvatarFallback>
          </Avatar>
          <span className="hidden font-medium sm:inline">Sign In</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-space-panel px-2 pr-3 text-left text-sm text-foreground shadow-sm shadow-black/20 transition-colors hover:bg-space-panelStrong"
        >
          <Avatar className="h-7 w-7 border border-space-orange/30">
            <AvatarFallback className="bg-space-orange text-xs font-semibold text-space-void">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-36 truncate font-medium sm:inline">{displayName}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 border-white/10 bg-space-panel p-2 text-foreground shadow-2xl shadow-black/35"
      >
        <DropdownMenuLabel className="px-2 py-2">
          <span className="block text-sm text-white">{displayName}</span>
          <span className="mt-1 block truncate text-xs font-normal text-muted-foreground">
            {user?.email ?? fallbackExplorerName}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onSelect={handleLogout}
          className="cursor-pointer rounded-md text-muted-foreground focus:bg-white/10 focus:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
  const navigate = useNavigate();
  const { pathname, search } = useRouterState({
    select: (state) => ({
      pathname: state.location.pathname,
      search: state.location.search as { q?: unknown }
    })
  });
  const routeQuery = pathname.startsWith("/search") && typeof search.q === "string" ? search.q : "";
  const [query, setQuery] = useState(routeQuery);

  useEffect(() => {
    setQuery(routeQuery);
  }, [routeQuery]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextQuery = query.trim();

    void navigate({
      to: "/search",
      search: {
        q: nextQuery.length > 0 && nextQuery !== defaultNasaSearchQuery ? nextQuery : undefined
      }
    });
  };

  return (
    <form className="mx-auto hidden w-full max-w-[420px] items-center md:flex" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Search NASA imagery..."
          className="h-9 rounded-full border-white/10 bg-space-void/60 pl-10 pr-4 text-sm text-foreground shadow-inner shadow-black/20 placeholder:text-muted-foreground focus-visible:ring-space-cyan/70"
          aria-label="Search NASA imagery"
        />
      </div>
    </form>
  );
}

function MobileSearchLink() {
  const navigate = useNavigate();
  const openMobileFilters = useUiStore(uiSelectors.openMobileFiltersAction);

  const handleClick = () => {
    void navigate({ to: "/search" });
    openMobileFilters();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:bg-white/5 hover:text-foreground md:hidden"
      aria-label="Search"
      onClick={handleClick}
    >
      <Search className="h-5 w-5" />
    </Button>
  );
}

type MobileBottomNavProps = {
  pathname: string;
};

type MobileNavItem = {
  to: AppNavTarget;
  label: string;
  icon: LucideIcon;
};

const mobileNavItems: readonly MobileNavItem[] = [
  { to: "/search", label: "Explore", icon: Grid2X2 },
  { to: "/collections", label: "Collections", icon: Library },
  { to: "/comparator", label: "Compare", icon: GitCompareArrows }
];

function MobileBottomNav({ pathname }: MobileBottomNavProps) {
  return (
    <nav className="cosmara-mobile-nav" aria-label="Mobile navigation">
      {mobileNavItems.map((item) => {
        const active = isRouteActive(pathname, item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-md px-3 py-1.5 text-[10px] font-medium transition-colors",
              active ? "text-space-orange" : "text-muted-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
