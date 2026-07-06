import { useLocalSearchParams } from "expo-router";
import { Check, Timer } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { Screen } from "@/components/layout/screen";
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  PageHeader,
  Textarea,
} from "@/components/ui";
import { useWorkout } from "@/hooks/queries/useWorkouts";
import { formatElapsedTime } from "@/lib/training/catalog";

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workout = useWorkout(id);
  const [elapsed, setElapsed] = React.useState(0);
  const [completed, setCompleted] = React.useState<string[]>([]);
  const [sessionRpe, setSessionRpe] = React.useState(7);
  const [notes, setNotes] = React.useState("");
  const [finished, setFinished] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (workout.isLoading) {
    return <RepScriptLoader label="Loading workout" />;
  }

  if (!workout.data) {
    return (
      <Screen>
        <EmptyState
          icon={Timer}
          title="Workout did not load"
          description="Your connection dropped before we could pull the full session."
        />
      </Screen>
    );
  }

  const exercises = workout.data.session.exercises;
  const volume = completed.length * 800;

  if (finished) {
    return (
      <Screen contentClassName="gap-4">
        <PageHeader
          className="-mx-6 -mt-6"
          description="Session complete"
          title={workout.data.title}
        />
        <Card>
          <CardContent className="gap-4 pt-4">
            <View className="items-center gap-2">
              <View className="size-14 items-center justify-center rounded-full bg-green-100">
                <Check color="#15803d" size={28} />
              </View>
              <Text className="text-center text-xl font-bold text-foreground dark:text-foreground-dark">
                Set work locked in
              </Text>
              <Text className="text-center text-sm text-muted-foreground dark:text-muted-foreground-dark">
                {completed.length} sets - {formatElapsedTime(elapsed)} - RPE {sessionRpe}
              </Text>
            </View>
            <View className="rounded-lg bg-muted p-4 dark:bg-muted-dark">
              <Text className="text-xs font-medium uppercase text-muted-foreground dark:text-muted-foreground-dark">
                Estimated volume
              </Text>
              <Text className="mt-1 text-2xl font-bold text-foreground dark:text-foreground-dark">
                {volume.toLocaleString()} kg
              </Text>
            </View>
            {notes ? (
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Notes: {notes}
              </Text>
            ) : null}
          </CardContent>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description={`${formatElapsedTime(elapsed)} elapsed`}
        title={workout.data.title}
      />

      <Card className="border-primary/30">
        <CardContent className="gap-3 pt-4">
          <Text className="text-xs font-semibold uppercase text-muted-foreground dark:text-muted-foreground-dark">
            Current session
          </Text>
          {exercises.map((exercise, index) => {
            const done = completed.includes(exercise.id);
            const active = !done && completed.length === index;

            return (
              <Pressable
                className={`rounded-lg border p-3 ${
                  active
                    ? "border-primary bg-secondary"
                    : "border-border bg-card dark:border-border-dark dark:bg-card-dark"
                }`}
                key={exercise.id}
                onPress={() =>
                  setCompleted((current) =>
                    current.includes(exercise.id)
                      ? current.filter((item) => item !== exercise.id)
                      : [...current, exercise.id],
                  )
                }
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`size-7 items-center justify-center rounded-full ${
                      done ? "bg-green-100" : "bg-muted dark:bg-muted-dark"
                    }`}
                  >
                    {done ? <Check color="#15803d" size={16} /> : null}
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                      {exercise.name}
                    </Text>
                    <Text className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      {exercise.prescription}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="gap-4 pt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
              Session RPE
            </Text>
            <View className="flex-row items-center gap-2">
              <Button
                label="-"
                onPress={() => setSessionRpe((value) => Math.max(1, value - 1))}
                size="icon"
                variant="outline"
              />
              <Text className="w-8 text-center text-xl font-bold text-foreground dark:text-foreground-dark">
                {sessionRpe}
              </Text>
              <Button
                label="+"
                onPress={() => setSessionRpe((value) => Math.min(10, value + 1))}
                size="icon"
                variant="outline"
              />
            </View>
          </View>
          <Textarea
            onChangeText={setNotes}
            placeholder="Athlete notes..."
            value={notes}
          />
          <Button
            disabled={completed.length === 0}
            label="Complete Workout"
            onPress={() => setFinished(true)}
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
