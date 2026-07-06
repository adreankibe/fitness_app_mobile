import { router, useLocalSearchParams } from "expo-router";
import { ChevronDown, ChevronRight, Dumbbell } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

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
import { useProgram } from "@/hooks/queries/usePrograms";
import type { ProgramStatus, ProgramWeek } from "@/lib/training/catalog";

function statusVariant(status: ProgramStatus) {
  if (status === "ACTIVE") return "success";
  if (status === "DRAFT") return "secondary";
  return "outline";
}

function WeekBlock({
  expanded,
  onToggle,
  programId,
  week,
}: {
  expanded: boolean;
  onToggle: () => void;
  programId: string;
  week: ProgramWeek;
}) {
  const Icon = expanded ? ChevronDown : ChevronRight;

  return (
    <Card>
      <Pressable
        className="flex-row items-center gap-2 px-4 py-4"
        onPress={onToggle}
      >
        <Icon color="#64748b" size={18} />
        <View className="min-w-0 flex-1">
          <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
            Week {week.weekNumber}: {week.title}
          </Text>
          <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
            {week.sessions.length} sessions
          </Text>
        </View>
      </Pressable>
      {expanded ? (
        <CardContent className="gap-3 border-t border-border pt-4 dark:border-border-dark">
          {week.sessions.map((session) => (
            <Pressable
              key={session.id}
              onPress={() =>
                router.push(`/(app)/programs/${programId}/session/${session.id}`)
              }
            >
              <View className="rounded-lg border border-border bg-muted/40 p-3 dark:border-border-dark dark:bg-muted-dark/40">
                <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                  Day {session.day} - {session.title}
                </Text>
                <Text className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  {session.exercises.length} exercises - {session.estimatedMinutes} min
                </Text>
              </View>
            </Pressable>
          ))}
        </CardContent>
      ) : null}
    </Card>
  );
}

export default function ProgramDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const program = useProgram(id);
  const [expandedWeek, setExpandedWeek] = React.useState("week-1");

  if (program.isLoading) {
    return <RepScriptLoader label="Loading program" />;
  }

  if (!program.data) {
    return (
      <Screen>
        <EmptyState
          icon={Dumbbell}
          title="Program did not load"
          description="The training block is missing or your connection dropped."
          action={
            <Button
              label="Back to programs"
              onPress={() => router.push("/(app)/programs")}
            />
          }
        />
      </Screen>
    );
  }

  const programData = program.data;

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description={`${programData.durationWeeks} weeks - ${programData.sessionsPerWeek} sessions/week`}
        title={programData.title}
      />

      <Card>
        <CardContent className="gap-3 pt-4">
          <View className="flex-row items-center justify-between gap-3">
            <Badge variant={statusVariant(programData.status)}>
              {programData.status}
            </Badge>
            <Text className="text-xs font-medium text-muted-foreground dark:text-muted-foreground-dark">
              {programData.assignedAthleteCount} athletes assigned
            </Text>
          </View>
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            {programData.description}
          </Text>
          <View className="flex-row gap-2">
            <Button label="Edit" size="sm" variant="outline" />
            <Button label="Publish" size="sm" variant="secondary" />
            <Button label="Archive" size="sm" variant="ghost" />
          </View>
        </CardContent>
      </Card>

      <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
        Weeks
      </Text>
      {programData.weeks.length ? (
        <View className="gap-3">
          {programData.weeks.map((week) => (
            <WeekBlock
              key={week.id}
              expanded={expandedWeek === week.id}
              onToggle={() =>
                setExpandedWeek((current) => (current === week.id ? "" : week.id))
              }
              programId={programData.id}
              week={week}
            />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={Dumbbell}
          title="No sessions programmed"
          description="Add week structure before assigning this block to athletes."
        />
      )}
    </Screen>
  );
}
