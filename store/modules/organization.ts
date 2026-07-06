import { create } from "zustand";

import type { CurrentUserMembership, Organization } from "@/types/api";

export type OrganizationState = {
  activeOrganizationId: string | null;
  organizations: Organization[];
  memberships: CurrentUserMembership[];
  permissions: string[];
  setActiveOrganization: (organizationId: string | null) => void;
  setOrganizations: (organizations: Organization[]) => void;
  hydrateFromMemberships: (
    memberships: CurrentUserMembership[],
    preferredOrganizationId?: string | null,
  ) => void;
  reset: () => void;
};

function resolveMembership(
  memberships: CurrentUserMembership[],
  preferredOrganizationId?: string | null,
) {
  if (preferredOrganizationId) {
    const preferred = memberships.find(
      (membership) => membership.organizationId === preferredOrganizationId,
    );
    if (preferred) {
      return preferred;
    }
  }

  return memberships[0] ?? null;
}

export const useOrganizationStore = create<OrganizationState>()((set) => ({
  activeOrganizationId: null,
  organizations: [],
  memberships: [],
  permissions: [],
  setActiveOrganization: (organizationId) =>
    set((state) => {
      const membership =
        state.memberships.find(
          (item) => item.organizationId === organizationId,
        ) ?? null;

      return {
        activeOrganizationId: organizationId,
        permissions: membership?.permissions ?? [],
      };
    }),
  setOrganizations: (organizations) => set({ organizations }),
  hydrateFromMemberships: (memberships, preferredOrganizationId) => {
    const membership = resolveMembership(memberships, preferredOrganizationId);

    set({
      activeOrganizationId: membership?.organizationId ?? null,
      memberships,
      permissions: membership?.permissions ?? [],
    });
  },
  reset: () =>
    set({
      activeOrganizationId: null,
      organizations: [],
      memberships: [],
      permissions: [],
    }),
}));
