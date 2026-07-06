import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text } from "react-native";

import { RepScriptLoader, RoleBadge } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Card, CardContent, CardHeader, CardTitle, ListRow, PageHeader } from "@/components/ui";
import { useTeam } from "@/hooks/queries/useTeams";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const team = useTeam(id);

  if (team.isLoading) {
    return <RepScriptLoader label="Loading team" />;
  }

  const data = team.data;

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description={data?.description ?? "Team detail"}
        title={data?.name ?? "Team"}
      />
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {data?.members.length ? (
            data.members.map((member) => (
              <ListRow
                description={member.email}
                key={member.teamMembershipId}
                title={member.fullName ?? "Unnamed member"}
                trailing={<RoleBadge role={member.teamRole} />}
              />
            ))
          ) : (
            <Text className="p-4 text-sm text-muted-foreground dark:text-muted-foreground-dark">
              No members assigned.
            </Text>
          )}
        </CardContent>
      </Card>
    </Screen>
  );
}
