import React from "react";
import { ScrollView, Text, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { appEnv } from "@/constants/env";
import { useHealthCheck } from "@/hooks/use-health-check";

export default function HomeScreen() {
  const health = useHealthCheck();

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerClassName="gap-4 p-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <PageHeader
        actions={<ThemeToggle />}
        className="-mx-6 -mt-6"
        description="Expo mobile environment ready"
        title="Fitness Coaching"
      />

      <Card>
        <CardHeader>
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <CardTitle>Backend API</CardTitle>
              <CardDescription selectable>{appEnv.apiUrl}</CardDescription>
            </View>
            <Badge
              variant={
                health.isLoading
                  ? "secondary"
                  : health.isError
                    ? "destructive"
                    : "success"
              }
            >
              {health.isLoading
                ? "checking"
                : health.isError
                  ? "unreachable"
                  : "reachable"}
            </Badge>
          </View>
        </CardHeader>
        <CardContent>
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            Mobile sends Supabase bearer token to NestJS /v1 routes.
          </Text>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
