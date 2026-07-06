import { useAthletesStore } from "@/store/modules/athletes";
import { useAuditEventsStore } from "@/store/modules/audit-events";
import { useInvitationsStore } from "@/store/modules/invitations";
import { useMembersStore } from "@/store/modules/members";
import { useOrganizationsStore } from "@/store/modules/organizations";
import { useProgramsStore } from "@/store/modules/programs";
import { useTeamsStore } from "@/store/modules/teams";
import { useWorkoutsStore } from "@/store/modules/workouts";

export function resetOrganizationScopedStores() {
  useAthletesStore.getState().resetStore();
  useAuditEventsStore.getState().resetStore();
  useInvitationsStore.getState().resetStore();
  useMembersStore.getState().resetStore();
  useProgramsStore.getState().resetStore();
  useTeamsStore.getState().resetStore();
  useWorkoutsStore.getState().resetStore();

  useOrganizationsStore.setState({
    currentOrganization: null,
    error: null,
    isLoading: false,
    isSaving: false,
  });
}
