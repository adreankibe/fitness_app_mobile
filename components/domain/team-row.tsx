import { router } from "expo-router";
import { UsersRound } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { ListRow } from "@/components/ui/list-row";
import type { TeamSummary } from "@/types/api";

type TeamRowProps = {
  team: TeamSummary;
};

export function TeamRow({ team }: TeamRowProps) {
  return (
    <ListRow
      description={team.description ?? `${team.memberCount} members`}
      leading={
        <View className="size-10 items-center justify-center rounded-lg bg-secondary dark:bg-secondary-dark">
          <UsersRound color="#1b1b41" size={18} />
        </View>
      }
      onPress={() => router.push(`/(app)/members/teams/${team.id}`)}
      showChevron
      title={team.name}
      trailing={<Badge variant="secondary">{String(team.memberCount)}</Badge>}
    />
  );
}
