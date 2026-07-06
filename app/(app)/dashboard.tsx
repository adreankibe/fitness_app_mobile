import { router } from "expo-router";
import { Dumbbell, Plus, Settings, Timer } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

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
import { useAuditEvents } from "@/hooks/queries/useAuditEvents";
import { useCurrentOrganization } from "@/hooks/queries/useOrganizations";
import { useMembers } from "@/hooks/queries/useMembers";
import { usePrograms } from "@/hooks/queries/usePrograms";
import { useTeams } from "@/hooks/queries/useTeams";
import { useWorkouts } from "@/hooks/queries/useWorkouts";
import { hasPermission } from "@/lib/permissions/access";
import { useOrganizationStore } from "@/store/modules/organization";

function formatWorkoutDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default function DashboardScreen() {
  const user = useAuthMe();
  const organization = useCurrentOrganization();
  const members = useMembers({ page: 1, pageSize: 5 });
  const teams = useTeams();
  const programs = usePrograms({ status: "ACTIVE" });
  const workouts = useWorkouts({ status: "SCHEDULED" });
  const auditEvents = useAuditEvents({ page: 1, pageSize: 5 });
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

      <View className="flex-row gap-3">
        <Card className="flex-1">
          <CardContent className="pt-4">
            <Text className="text-xs font-medium uppercase text-muted-foreground dark:text-muted-foreground-dark">
              Active programs
            </Text>
            <Text className="mt-2 text-3xl font-bold text-foreground dark:text-foreground-dark">
              {programs.data?.length ?? 0}
            </Text>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardContent className="pt-4">
            <Text className="text-xs font-medium uppercase text-muted-foreground dark:text-muted-foreground-dark">
              Scheduled
            </Text>
            <Text className="mt-2 text-3xl font-bold text-foreground dark:text-foreground-dark">
              {workouts.data?.length ?? 0}
            </Text>
          </CardContent>
        </Card>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Coach command</CardTitle>
          <CardDescription>
            Fast routes for member, team, and training work.
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
          <Button
            label="Open programs"
            leftIcon={<Dumbbell color="#1b1b41" size={16} />}
            onPress={() => router.push("/(app)/programs")}
            variant="secondary"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming workouts</CardTitle>
          <CardDescription>
            Seeded until the athlete/workout backend contract is implemented.
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-3">
          {(workouts.data ?? []).slice(0, 2).map((workout) => (
            <Pressable
              className="rounded-lg border border-border p-3 dark:border-border-dark"
              key={workout.id}
              onPress={() => router.push(`/(app)/workouts/${workout.id}`)}
            >
              <View className="flex-row items-center gap-3">
                <View className="size-9 items-center justify-center rounded-lg bg-secondary">
                  <Timer color="#1b1b41" size={18} />
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                    {workout.title}
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground-dark">
                    {formatWorkoutDate(workout.scheduledFor)} - {workout.programTitle}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
          <CardDescription>Latest organization events.</CardDescription>
        </CardHeader>
        <CardContent className="gap-3">
          {(auditEvents.data?.items ?? []).slice(0, 3).map((event) => (
            <View
              className="rounded-lg border border-border p-3 dark:border-border-dark"
              key={event.id}
            >
              <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                {event.action}
              </Text>
              <Text className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground-dark">
                {event.targetType} - {new Date(event.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
          {!auditEvents.data?.items.length ? (
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              No activity yet.
            </Text>
          ) : null}
        </CardContent>
      </Card>
    </Screen>
  );
}
