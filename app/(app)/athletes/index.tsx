import { router } from "expo-router";
import { Activity, Search, UsersRound } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { RepScriptLoader, StatusBadge } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Card, CardContent, EmptyState, Input, PageHeader } from "@/components/ui";
import { useAthletes } from "@/hooks/queries/useAthletes";
import { formatAdherence } from "@/lib/athletes/catalog";

export default function AthletesScreen() {
  const [q, setQ] = React.useState("");
  const athletes = useAthletes();
  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return athletes.data ?? [];
    return (athletes.data ?? []).filter((athlete) =>
      `${athlete.fullName} ${athlete.email ?? ""} ${athlete.currentProgram ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [athletes.data, q]);

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description="Review adherence, readiness, and recent workout logs."
        title="Athletes"
      />
      <Input
        leftIcon={<Search color="#64748b" size={16} />}
        onChangeText={setQ}
        placeholder="Search athletes..."
        value={q}
      />

      {athletes.isLoading ? <RepScriptLoader label="Loading athletes" /> : null}

      {!athletes.isLoading && filtered.length === 0 ? (
        <EmptyState
          icon={UsersRound}
          title="No athletes on the board"
          description="Assigned athletes and their workout logs will appear here."
        />
      ) : null}

      <View className="gap-3">
        {filtered.map((athlete) => (
          <Pressable
            key={athlete.id}
            onPress={() => router.push(`/(app)/athletes/${athlete.id}`)}
          >
            <Card>
              <CardContent className="gap-3 pt-4">
                <View className="flex-row items-start justify-between gap-3">
                  <View className="min-w-0 flex-1">
                    <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                      {athlete.fullName}
                    </Text>
                    <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      {athlete.currentProgram ?? "No active program"}
                    </Text>
                  </View>
                  <StatusBadge status={athlete.status} />
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1 rounded-lg bg-muted p-3 dark:bg-muted-dark">
                    <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      Adherence
                    </Text>
                    <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
                      {formatAdherence(athlete.adherencePercent)}
                    </Text>
                  </View>
                  <View className="flex-1 rounded-lg bg-muted p-3 dark:bg-muted-dark">
                    <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                      Readiness
                    </Text>
                    <Text className="text-sm font-semibold text-foreground dark:text-foreground-dark">
                      {athlete.readiness}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Activity color="#64748b" size={14} />
                  <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                    Next: {athlete.upcomingWorkoutTitle ?? "No session scheduled"}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
