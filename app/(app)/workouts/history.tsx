import { CalendarDays } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { Screen } from "@/components/layout/screen";
import { Badge, Card, CardContent, EmptyState, PageHeader } from "@/components/ui";
import { useWorkouts } from "@/hooks/queries/useWorkouts";
import type { WorkoutLog, WorkoutStatus } from "@/lib/training/catalog";

const days = Array.from({ length: 31 }, (_, index) => index + 1);

function statusVariant(status: WorkoutStatus) {
  if (status === "COMPLETED") return "success";
  if (status === "MISSED") return "destructive";
  if (status === "IN_PROGRESS") return "info";
  return "secondary";
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function HistoryCard({ workout }: { workout: WorkoutLog }) {
  return (
    <Card>
      <CardContent className="gap-2 pt-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="min-w-0 flex-1">
            <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
              {workout.title}
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground-dark">
              {workout.sessionRpe ? `RPE ${workout.sessionRpe} - ` : ""}
              {workout.estimatedMinutes} min
            </Text>
          </View>
          <Badge variant={statusVariant(workout.status)}>{workout.status}</Badge>
        </View>
        {workout.volumeKg ? (
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            Volume: {workout.volumeKg.toLocaleString()} kg
          </Text>
        ) : (
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            Scheduled for 6:00 AM
          </Text>
        )}
      </CardContent>
    </Card>
  );
}

export default function WorkoutHistoryScreen() {
  const workouts = useWorkouts();

  if (workouts.isLoading) {
    return <RepScriptLoader label="Loading history" />;
  }

  const history =
    workouts.data?.filter(
      (workout) => workout.status === "COMPLETED" || workout.status === "MISSED",
    ) ?? [];
  const workoutDays = new Set(
    history.map((workout) => new Date(workout.scheduledFor).getUTCDate()),
  );

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description="July 2026"
        title="Workout History"
      />

      <Card>
        <CardContent className="gap-3 pt-4">
          <View className="flex-row justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <Text
                className="w-8 text-center text-xs font-semibold text-muted-foreground dark:text-muted-foreground-dark"
                key={`${day}-${index}`}
              >
                {day}
              </Text>
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {days.map((day) => {
              const hasWorkout = workoutDays.has(day);
              return (
                <View
                  className={`size-8 items-center justify-center rounded-full ${
                    hasWorkout ? "bg-primary" : "bg-muted dark:bg-muted-dark"
                  }`}
                  key={day}
                >
                  <Text
                    className={`text-xs font-medium ${
                      hasWorkout
                        ? "text-primary-foreground"
                        : "text-muted-foreground dark:text-muted-foreground-dark"
                    }`}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </CardContent>
      </Card>

      {history.length ? (
        <View className="gap-3">
          {history.map((workout) => (
            <View className="gap-2" key={workout.id}>
              <Text className="text-xs font-semibold uppercase text-muted-foreground dark:text-muted-foreground-dark">
                {formatLongDate(workout.scheduledFor)}
              </Text>
              <HistoryCard workout={workout} />
            </View>
          ))}
        </View>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No PRs on the board yet"
          description="Log your sessions and completed work will show up here."
        />
      )}
    </Screen>
  );
}
