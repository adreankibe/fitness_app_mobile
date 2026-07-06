import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { createOrganizationSchema } from "@/lib/schemas/forms";
import { useAuthSessionStore } from "@/store/modules/auth-session";
import { useOrganizationsStore } from "@/store/modules/organizations";

type CreateOrgForm = z.infer<typeof createOrganizationSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function CreateOrganizationScreen() {
  const createOrganization = useOrganizationsStore((state) => state.createOrganization);
  const fetchAuthMe = useAuthSessionStore((state) => state.fetchAuthMe);
  const toast = useToast();
  const form = useForm<CreateOrgForm>({
    defaultValues: {
      name: "",
      slug: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    resolver: zodResolver(createOrganizationSchema),
  });

  const mutation = useMutation({
    mutationFn: createOrganization,
    onSuccess: async () => {
      await fetchAuthMe();
      router.replace("/");
    },
    onError: (error) =>
      toast.showToast({
        title: "Organization not created",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      }),
  });

  return (
    <Screen contentClassName="gap-6">
      <View>
        <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark">
          Create organization
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
          Set up the gym, club, or coaching workspace athletes will join.
        </Text>
      </View>

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
                  onBlur={field.onBlur}
                  onChangeText={(value) => {
                    field.onChange(value);
                    form.setValue("slug", slugify(value), {
                      shouldValidate: true,
                    });
                  }}
                  placeholder="RepScript Strength"
                  value={field.value}
                />
              </View>
            )}
          />
          <Controller
            control={form.control}
            name="slug"
            render={({ field }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  Slug
                </Text>
                <Input
                  autoCapitalize="none"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  placeholder="repscript-strength"
                  value={field.value}
                />
              </View>
            )}
          />
          <Controller
            control={form.control}
            name="timezone"
            render={({ field }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  Timezone
                </Text>
                <Input onChangeText={field.onChange} value={field.value} />
              </View>
            )}
          />
          <Button
            label="Create workspace"
            loading={mutation.isPending}
            onPress={form.handleSubmit((values) => mutation.mutate(values))}
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
