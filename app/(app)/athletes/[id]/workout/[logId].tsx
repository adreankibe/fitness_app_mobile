import { useLocalSearchParams } from "expo-router";
import { ClipboardList } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { RepScriptLoader, StatusBadge } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Card, CardContent, EmptyState, PageHeader } from "@/components/ui";
import { useAthleteWorkoutLog } from "@/hooks/queries/useAthletes";

export default function AthleteWorkoutLogScreen() {
  const { id, logId } = useLocalSearchParams<{ id: string; logId: string }>();
  const log = useAthleteWorkoutLog(id, logId);

  if (log.isLoading) {
    return <RepScriptLoader label="Loading workout log" />;
  }

  if (!log.data) {
    return (
      <Screen>
        <EmptyState
          icon={ClipboardList}
          title="Workout log did not load"
          description="The session log is missing or your connection dropped."
        />
      </Screen>
    );
  }

  const data = log.data;

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description={`${data.durationMinutes ?? 0} min - ${data.volumeKg.toLocaleString()} kg`}
        title={data.title}
      />

      <Card>
        <CardContent className="gap-3 pt-4">
          <View className="flex-row items-center justify-between gap-3">
            <StatusBadge status={data.status} />
            <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
              RPE {data.sessionRpe ?? "-"}
            </Text>
          </View>
          {data.coachNotes ? (
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              Coach note: {data.coachNotes}
            </Text>
          ) : null}
          {data.athleteNotes ? (
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              Athlete note: {data.athleteNotes}
            </Text>
          ) : null}
        </CardContent>
      </Card>

      <View className="gap-3">
        {data.exercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardContent className="gap-2 pt-4">
              <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                {exercise.name}
              </Text>
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Top set: {exercise.topSet}
              </Text>
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Volume: {exercise.volumeKg.toLocaleString()} kg
              </Text>
              {exercise.notes ? (
                <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  {exercise.notes}
                </Text>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
