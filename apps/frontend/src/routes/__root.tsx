import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootRoute
});

const isUnderCypress = typeof window !== "undefined" && "Cypress" in window;

function RootRoute() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && !isUnderCypress ? (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </>
      ) : null}
    </>
  );
}
