import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { sessionEvents } from "@/api/sessionEvents";
import { AppToaster } from "@/components/app/AppToaster";
import { queryClient } from "@/lib/queryClient";
import { routeTree } from "@/routeTree";
import { authSelectors, useAuthStore } from "@/store";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionEventBridge />
      <RouterProvider router={router} />
      <AppToaster />
    </QueryClientProvider>
  );
}

function SessionEventBridge() {
  const setSession = useAuthStore(authSelectors.setSessionAction);
  const clearSession = useAuthStore(authSelectors.clearSessionAction);

  useEffect(() => {
    const unsubscribeRefreshed = sessionEvents.onSessionRefreshed(setSession);
    const unsubscribeExpired = sessionEvents.onSessionExpired(() => {
      clearSession();
      queryClient.clear();
      void router.navigate({ to: "/auth" });
    });

    return () => {
      unsubscribeRefreshed();
      unsubscribeExpired();
    };
  }, [clearSession, setSession]);

  return null;
}

export default App;
