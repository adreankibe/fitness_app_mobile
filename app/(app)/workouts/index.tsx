import { router } from "expo-router";
import { CalendarDays, Timer } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { Screen } from "@/components/layout/screen";
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  PageHeader,
} from "@/components/ui";
import { useWorkouts } from "@/hooks/queries/useWorkouts";
import type { WorkoutLog, WorkoutStatus } from "@/lib/training/catalog";

const filters: Array<"ALL" | WorkoutStatus> = [
  "ALL",
  "SCHEDULED",
  "IN_PROGRESS",
  "COMPLETED",
];

function statusVariant(status: WorkoutStatus) {
  if (status === "COMPLETED") return "success";
  if (status === "MISSED") return "destructive";
  if (status === "IN_PROGRESS") return "info";
  return "secondary";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function WorkoutCard({ workout }: { workout: WorkoutLog }) {
  const canStart =
    workout.status === "SCHEDULED" || workout.status === "IN_PROGRESS";

  return (
    <Pressable onPress={() => router.push(`/(app)/workouts/${workout.id}`)}>
      <Card>
        <CardContent className="gap-3 pt-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                {workout.title}
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                {workout.programTitle}
              </Text>
            </View>
            <Badge variant={statusVariant(workout.status)}>{workout.status}</Badge>
          </View>
          <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
            {formatDate(workout.scheduledFor)} - {workout.exerciseCount} exercises - Est.{" "}
            {workout.estimatedMinutes} min
          </Text>
          {workout.notes ? (
            <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
              Notes: {workout.notes}
            </Text>
          ) : null}
          {canStart ? (
            <Button
              label={workout.status === "IN_PROGRESS" ? "Resume" : "Start"}
              onPress={() => router.push(`/(app)/workouts/${workout.id}`)}
              size="sm"
            />
          ) : null}
        </CardContent>
      </Card>
    </Pressable>
  );
}

export default function WorkoutsScreen() {
  const [status, setStatus] = React.useState<"ALL" | WorkoutStatus>("ALL");
  const workouts = useWorkouts({ status });

  if (workouts.isLoading) {
    return <RepScriptLoader label="Loading workouts" />;
  }

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        actions={
          <Button
            label="History"
            onPress={() => router.push("/(app)/workouts/history")}
            size="sm"
            variant="outline"
          />
        }
        className="-mx-6 -mt-6"
        description="This week's training"
        title="My Workouts"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {filters.map((item) => (
          <Pressable key={item} onPress={() => setStatus(item)}>
            <Badge
              variant={status === item ? "default" : "secondary"}
              className="px-3 py-1"
            >
              {item === "ALL" ? "All" : item}
            </Badge>
          </Pressable>
        ))}
      </ScrollView>

      {workouts.data?.length ? (
        <View className="gap-3">
          {workouts.data.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No lifts scheduled"
          description="Your training week is clear. Recovery counts too."
        />
      )}
    </Screen>
  );
}
