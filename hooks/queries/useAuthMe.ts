import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth";
import { useOrganizationStore } from "@/store/modules/organization";
import { queryKeys } from "@/hooks/queries/keys";

export function useAuthMe(enabled = true) {
  const hydrateFromMemberships = useOrganizationStore(
    (state) => state.hydrateFromMemberships,
  );

  return useQuery({
    queryKey: queryKeys.authMe,
    queryFn: async () => {
      const user = await authService.me();
      hydrateFromMemberships(user.memberships, user.activeOrganizationId);
      return user;
    },
    enabled,
  });
}
