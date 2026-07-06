import React from "react";

import { useUsersStore } from "@/store/modules/users";

export function useUserMe(enabled = true) {
  const store = useUsersStore();

  React.useEffect(() => {
    if (enabled) {
      void store.fetchMe();
    }
  }, [enabled]);

  return {
    data: store.me ?? undefined,
    isLoading: store.isLoading,
    error: store.error,
    refetch: store.fetchMe,
  };
}
