import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { queryClient } from "@/lib/query/client";
import { useOrganizationStore } from "@/store/modules/organization";
import { resetOrganizationScopedStores } from "@/store/modules/organization-scoped";

function OrganizationScopedStoreResetter() {
  const activeOrganizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const previousOrganizationId = React.useRef<string | null | undefined>(
    undefined,
  );

  React.useEffect(() => {
    if (
      previousOrganizationId.current !== undefined &&
      previousOrganizationId.current !== activeOrganizationId
    ) {
      resetOrganizationScopedStores();
    }

    previousOrganizationId.current = activeOrganizationId;
  }, [activeOrganizationId]);

  return null;
}

export function AppProviders({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <OrganizationScopedStoreResetter />
            {children}
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
