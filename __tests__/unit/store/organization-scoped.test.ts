import { resetOrganizationScopedStores } from "@/store/modules/organization-scoped";
import { useAuditEventsStore } from "@/store/modules/audit-events";
import { useMembersStore } from "@/store/modules/members";
import { useOrganizationsStore } from "@/store/modules/organizations";
import { useTeamsStore } from "@/store/modules/teams";

describe("resetOrganizationScopedStores", () => {
  it("clears organization-bound data when active organization changes", () => {
    useMembersStore.setState({
      members: { items: [], page: 1, pageSize: 20, total: 0 },
      memberDetails: { member1: {} as never },
    });
    useTeamsStore.setState({
      teams: { items: [] },
      teamDetails: { team1: {} as never },
    });
    useAuditEventsStore.setState({
      auditEvents: { items: [], page: 1, pageSize: 20, total: 0 },
    });
    useOrganizationsStore.setState({
      currentOrganization: {} as never,
      organizations: [
        {
          id: "org-1",
          memberCount: 1,
          membershipStatus: "ACTIVE",
          name: "Forge",
          role: "OWNER",
          slug: "forge",
          status: "ACTIVE",
        },
      ],
    });

    resetOrganizationScopedStores();

    expect(useMembersStore.getState().members).toBeNull();
    expect(useMembersStore.getState().memberDetails).toEqual({});
    expect(useTeamsStore.getState().teams).toBeNull();
    expect(useTeamsStore.getState().teamDetails).toEqual({});
    expect(useAuditEventsStore.getState().auditEvents).toBeNull();
    expect(useOrganizationsStore.getState().currentOrganization).toBeNull();
    expect(useOrganizationsStore.getState().organizations).toHaveLength(1);
  });
});
