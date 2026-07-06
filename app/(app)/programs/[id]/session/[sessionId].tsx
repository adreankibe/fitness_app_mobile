import { useLocalSearchParams } from "expo-router";
import { Dumbbell } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { Screen } from "@/components/layout/screen";
import { Card, CardContent, EmptyState, PageHeader } from "@/components/ui";
import { useProgramSession } from "@/hooks/queries/usePrograms";
import type { ProgramExercise, SegmentType } from "@/lib/training/catalog";

const segmentLabels: Record<SegmentType, string> = {
  WARM_UP: "Warm-Up",
  MAIN_WORK: "Main Work",
  ACCESSORY: "Accessory",
  CONDITIONING: "Conditioning",
  COOLDOWN: "Cooldown",
};

const segmentBorder: Record<SegmentType, string> = {
  WARM_UP: "border-l-orange-400",
  MAIN_WORK: "border-l-blue-400",
  ACCESSORY: "border-l-purple-400",
  CONDITIONING: "border-l-green-400",
  COOLDOWN: "border-l-teal-400",
};

function groupBySegment(exercises: ProgramExercise[]) {
  return exercises.reduce(
    (groups, exercise) => {
      groups[exercise.segmentType] = [...(groups[exercise.segmentType] ?? []), exercise];
      return groups;
    },
    {} as Partial<Record<SegmentType, ProgramExercise[]>>,
  );
}

export default function ProgramSessionScreen() {
  const { id, sessionId } = useLocalSearchParams<{
    id: string;
    sessionId: string;
  }>();
  const session = useProgramSession(id, sessionId);

  if (session.isLoading) {
    return <RepScriptLoader label="Loading session" />;
  }

  if (!session.data) {
    return (
      <Screen>
        <EmptyState
          icon={Dumbbell}
          title="Session did not load"
          description="This session is missing from the selected training block."
        />
      </Screen>
    );
  }

  const groups = groupBySegment(session.data.exercises);

  return (
    <Screen contentClassName="gap-5">
      <PageHeader
        className="-mx-6 -mt-6"
        description={`Day ${session.data.day} - ${session.data.estimatedMinutes} min`}
        title={session.data.title}
      />

      {(Object.keys(segmentLabels) as SegmentType[]).map((segment) => {
        const exercises = groups[segment] ?? [];
        if (!exercises.length) return null;

        return (
          <View className="gap-3" key={segment}>
            <Text className="text-xs font-semibold uppercase text-muted-foreground dark:text-muted-foreground-dark">
              {segmentLabels[segment]}
            </Text>
            {exercises.map((exercise) => (
              <Card
                className={`border-l-4 ${segmentBorder[exercise.segmentType]}`}
                key={exercise.id}
              >
                <CardContent className="gap-2 pt-4">
                  <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                    {exercise.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                    {exercise.prescription}
                  </Text>
                  {exercise.notes ? (
                    <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      Coach note: {exercise.notes}
                    </Text>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </View>
        );
      })}
    </Screen>
  );
}
