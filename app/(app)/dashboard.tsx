import { router } from "expo-router";
import { Plus, Settings } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { Screen } from "@/components/layout/screen";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HeaderAction,
  PageHeader,
} from "@/components/ui";
import { useAuthMe } from "@/hooks/queries/useAuthMe";
import { useCurrentOrganization } from "@/hooks/queries/useOrganizations";
import { useMembers } from "@/hooks/queries/useMembers";
import { useTeams } from "@/hooks/queries/useTeams";
import { hasPermission } from "@/lib/permissions/access";
import { useOrganizationStore } from "@/store/modules/organization";

export default function DashboardScreen() {
  const user = useAuthMe();
  const organization = useCurrentOrganization();
  const members = useMembers({ page: 1, pageSize: 5 });
  const teams = useTeams();
  const permissions = useOrganizationStore((state) => state.permissions);

  if (user.isLoading || organization.isLoading) {
    return <RepScriptLoader label="Loading dashboard" />;
  }

  const currentOrg = organization.data;

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        actions={
          hasPermission(permissions, "org:update") ? (
            <HeaderAction
              icon={Settings}
              label="Organization settings"
              onPress={() => router.push("/(app)/org/settings")}
            />
          ) : null
        }
        className="-mx-6 -mt-6"
        description={currentOrg?.name ?? "RepScript workspace"}
        title={`Ready, ${user.data?.fullName?.split(" ")[0] ?? "Coach"}`}
      />

      <View className="flex-row gap-3">
        <Card className="flex-1">
          <CardContent className="pt-4">
            <Text className="text-xs font-medium uppercase text-muted-foreground dark:text-muted-foreground-dark">
              Active members
            </Text>
            <Text className="mt-2 text-3xl font-bold text-foreground dark:text-foreground-dark">
              {currentOrg?.counts.activeMembers ?? members.data?.total ?? 0}
            </Text>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="pt-4">
            <Text className="text-xs font-medium uppercase text-muted-foreground dark:text-muted-foreground-dark">
              Teams
            </Text>
            <Text className="mt-2 text-3xl font-bold text-foreground dark:text-foreground-dark">
              {currentOrg?.counts.teams ?? teams.data?.items.length ?? 0}
            </Text>
          </CardContent>
        </Card>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Coach command</CardTitle>
          <CardDescription>
            Fast routes for the work that exists in the backend today.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-3">
          <Button
            label="Invite athlete"
            leftIcon={<Plus color="#ffffff" size={16} />}
            onPress={() => router.push("/(app)/members/invite")}
          />
          <Button
            label="Create team"
            onPress={() => router.push("/(app)/members/teams/create")}
            variant="outline"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform line</CardTitle>
          <CardDescription>
            Programs and workout logging stay deferred until backend contracts
            are real.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <View className="h-1 rounded-full bg-primary" />
        </CardContent>
      </Card>
    </Screen>
  );
}
