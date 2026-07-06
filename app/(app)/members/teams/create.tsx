import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionState } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Input, PageHeader, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { teamSchema } from "@/lib/schemas/forms";
import { useTeamsStore } from "@/store/modules/teams";

type TeamForm = z.infer<typeof teamSchema>;

export default function CreateTeamScreen() {
  const createTeam = useTeamsStore((state) => state.createTeam);
  const toast = useToast();
  const form = useForm<TeamForm>({
    defaultValues: { description: "", name: "" },
    resolver: zodResolver(teamSchema),
  });

  const mutation = useMutation({
    mutationFn: createTeam,
    onSuccess: async () => {
      toast.showToast({ title: "Team created", variant: "success" });
      router.back();
    },
    onError: (error) =>
      toast.showToast({
        title: "Team not created",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      }),
  });

  return (
    <Screen>
      <PageHeader
        className="-mx-6 -mt-6"
        description="Create a focused training group."
        title="Create team"
      />
      <PermissionState permissions={["teams:create"]}>
        <Card>
          <CardContent className="gap-4 pt-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                    Name
                  </Text>
                  <Input
                    onChangeText={field.onChange}
                    placeholder="Powerlifting Team"
                    value={field.value}
                  />
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <Textarea
                  onChangeText={field.onChange}
                  placeholder="Competitive lifters and meet prep athletes"
                  value={field.value}
                />
              )}
            />
            <Button
              label="Create team"
              loading={mutation.isPending}
              onPress={form.handleSubmit((values) => mutation.mutate(values))}
            />
          </CardContent>
        </Card>
      </PermissionState>
    </Screen>
  );
}
