import { router, useLocalSearchParams } from "expo-router";
import { Dumbbell } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { RepScriptLoader } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Card, CardContent, EmptyState, PageHeader } from "@/components/ui";
import { useProgram } from "@/hooks/queries/usePrograms";

export default function ProgramWeekScreen() {
  const { id, weekId } = useLocalSearchParams<{ id: string; weekId: string }>();
  const program = useProgram(id);

  if (program.isLoading) {
    return <RepScriptLoader label="Loading week" />;
  }

  const programData = program.data;
  const week = programData?.weeks.find((item) => item.id === weekId);

  if (!programData || !week) {
    return (
      <Screen>
        <EmptyState
          icon={Dumbbell}
          title="Week did not load"
          description="This week is missing from the program."
        />
      </Screen>
    );
  }

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description={`${week.sessions.length} sessions in ${programData.title}`}
        title={`Week ${week.weekNumber}: ${week.title}`}
      />
      <View className="gap-3">
        {week.sessions.map((session) => (
          <Pressable
            key={session.id}
            onPress={() => router.push(`/(app)/programs/${programData.id}/session/${session.id}`)}
          >
            <Card>
              <CardContent className="gap-2 pt-4">
                <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                  Day {session.day}: {session.title}
                </Text>
                <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {session.exercises.length} exercises - {session.estimatedMinutes} min
                </Text>
              </CardContent>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
