import { router } from "expo-router";
import { Dumbbell, Plus, Search } from "lucide-react-native";
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
  Input,
  PageHeader,
} from "@/components/ui";
import { usePrograms } from "@/hooks/queries/usePrograms";
import type { ProgramStatus, ProgramTemplate } from "@/lib/training/catalog";

const statusFilters: Array<"ALL" | ProgramStatus> = [
  "ALL",
  "ACTIVE",
  "DRAFT",
  "ARCHIVED",
];

function programStatusVariant(status: ProgramStatus) {
  if (status === "ACTIVE") return "success";
  if (status === "DRAFT") return "secondary";
  return "outline";
}

function ProgramCard({ program }: { program: ProgramTemplate }) {
  return (
    <Pressable onPress={() => router.push(`/(app)/programs/${program.id}`)}>
      <Card>
        <CardContent className="gap-3 pt-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                {program.title}
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                {program.durationWeeks} weeks - {program.sessionsPerWeek} sessions/week
              </Text>
            </View>
            <Badge variant={programStatusVariant(program.status)}>
              {program.status}
            </Badge>
          </View>
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            {program.description}
          </Text>
          <Text className="text-xs font-medium text-muted-foreground dark:text-muted-foreground-dark">
            {program.assignedAthleteCount} athletes assigned
          </Text>
        </CardContent>
      </Card>
    </Pressable>
  );
}

export default function ProgramsScreen() {
  const [status, setStatus] = React.useState<"ALL" | ProgramStatus>("ALL");
  const [q, setQ] = React.useState("");
  const programs = usePrograms({ status, q });

  if (programs.isLoading) {
    return <RepScriptLoader label="Loading programs" />;
  }

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        actions={
          <Button
            label="Create"
            leftIcon={<Plus color="#ffffff" size={16} />}
            size="sm"
          />
        }
        className="-mx-6 -mt-6"
        description="Training program library"
        title="Programs"
      />

      <Input
        leftIcon={<Search color="#64748b" size={16} />}
        onChangeText={setQ}
        placeholder="Search programs..."
        value={q}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {statusFilters.map((item) => (
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

      {programs.data?.length ? (
        <View className="gap-3">
          {programs.data.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </View>
      ) : (
        <EmptyState
          icon={Dumbbell}
          title="No programs on the rack"
          description="Create a training block or clear the filters to see assigned programs."
        />
      )}
    </Screen>
  );
}
