import React from "react";

import { useAuthSessionStore } from "@/store/modules/auth-session";

export function useAuthMe(enabled = true) {
  const store = useAuthSessionStore();

  React.useEffect(() => {
    if (enabled) {
      void store.fetchAuthMe();
    }
  }, [enabled]);

  return {
    data: store.currentUser ?? undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchAuthMe,
  };
}
