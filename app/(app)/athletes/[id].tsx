import { router, useLocalSearchParams } from "expo-router";
import { Activity, Dumbbell, Timer } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { RepScriptLoader, StatusBadge } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Badge, Card, CardContent, EmptyState, PageHeader } from "@/components/ui";
import { useAthlete } from "@/hooks/queries/useAthletes";
import { formatAdherence } from "@/lib/athletes/catalog";

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const athlete = useAthlete(id);

  if (athlete.isLoading) {
    return <RepScriptLoader label="Loading athlete" />;
  }

  if (!athlete.data) {
    return (
      <Screen>
        <EmptyState
          icon={Dumbbell}
          title="Athlete did not load"
          description="This athlete is missing or your connection dropped."
        />
      </Screen>
    );
  }

  const data = athlete.data;

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description={data.email ?? "No email on profile"}
        title={data.fullName}
      />

      <Card>
        <CardContent className="gap-3 pt-4">
          <View className="flex-row items-center justify-between gap-3">
            <StatusBadge status={data.status} />
            <Badge variant="secondary">{data.currentProgram ?? "No program"}</Badge>
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1 rounded-lg bg-muted p-3 dark:bg-muted-dark">
              <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                Adherence
              </Text>
              <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
                {formatAdherence(data.adherencePercent)}
              </Text>
            </View>
            <View className="flex-1 rounded-lg bg-muted p-3 dark:bg-muted-dark">
              <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                Readiness
              </Text>
              <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                {data.readiness}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>

      <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
        Workout logs
      </Text>
      <View className="gap-3">
        {data.workoutLogs.map((log) => (
          <Pressable
            key={log.id}
            onPress={() => router.push(`/(app)/athletes/${data.id}/workout/${log.id}`)}
          >
            <Card>
              <CardContent className="gap-2 pt-4">
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                    {log.title}
                  </Text>
                  <StatusBadge status={log.status} />
                </View>
                <View className="flex-row gap-4">
                  <View className="flex-row items-center gap-1">
                    <Timer color="#64748b" size={14} />
                    <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      {log.durationMinutes ? `${log.durationMinutes} min` : "Not logged"}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Activity color="#64748b" size={14} />
                    <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      {log.volumeKg.toLocaleString()} kg
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
