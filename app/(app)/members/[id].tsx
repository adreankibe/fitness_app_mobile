import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import {
  RepScriptLoader,
  RoleBadge,
  StatusBadge,
} from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import {
  Avatar,
  AvatarFallback,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@/components/ui";
import { useMember } from "@/hooks/queries/useMembers";

function initials(name: string | null | undefined) {
  return (name ?? "Member")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const member = useMember(id);

  if (member.isLoading) {
    return <RepScriptLoader label="Loading member" />;
  }

  const data = member.data;

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description={data?.profile.email ?? undefined}
        title={data?.profile.fullName ?? "Member"}
      />

      <Card>
        <CardContent className="items-center gap-3 pt-6">
          <Avatar size="lg">
            <AvatarFallback>{initials(data?.profile.fullName)}</AvatarFallback>
          </Avatar>
          <View className="flex-row gap-2">
            {data ? <RoleBadge role={data.role} /> : null}
            {data ? <StatusBadge status={data.status} /> : null}
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {data?.teams.length ? (
            data.teams.map((team) => (
              <Text
                className="text-sm text-foreground dark:text-foreground-dark"
                key={team.id}
              >
                {team.name}
              </Text>
            ))
          ) : (
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              No team assignments yet.
            </Text>
          )}
        </CardContent>
      </Card>
    </Screen>
  );
}
