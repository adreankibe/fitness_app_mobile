import { router } from "expo-router";
import { Plus, Search, UsersRound } from "lucide-react-native";
import React from "react";

import { PermissionState, RepScriptLoader, TeamRow } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Card, CardContent, EmptyState, HeaderAction, Input, PageHeader } from "@/components/ui";
import { useTeams } from "@/hooks/queries/useTeams";
import { hasPermission } from "@/lib/permissions/access";
import { useOrganizationStore } from "@/store/modules/organization";

export default function TeamsScreen() {
  const [q, setQ] = React.useState("");
  const permissions = useOrganizationStore((state) => state.permissions);
  const teams = useTeams({ q });

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        actions={
          hasPermission(permissions, "teams:create") ? (
            <HeaderAction
              icon={Plus}
              label="Create team"
              onPress={() => router.push("/(app)/members/teams/create")}
            />
          ) : null
        }
        className="-mx-6 -mt-6"
        description="Group athletes and coaches by training focus."
        title="Teams"
      />

      <PermissionState permissions={["teams:list"]}>
        <Input
          leftIcon={<Search color="#64748b" size={16} />}
          onChangeText={setQ}
          placeholder="Search teams..."
          value={q}
        />
        {teams.isLoading ? <RepScriptLoader label="Loading teams" /> : null}
        {!teams.isLoading && teams.data?.items.length === 0 ? (
          <EmptyState
            icon={UsersRound}
            title="No training groups yet"
            description="Create a team for powerlifting, hypertrophy, meet prep, or beginners."
          />
        ) : null}
        <Card>
          <CardContent className="px-0 py-0">
            {teams.data?.items.map((team) => (
              <TeamRow key={team.id} team={team} />
            ))}
          </CardContent>
        </Card>
      </PermissionState>
    </Screen>
  );
}
