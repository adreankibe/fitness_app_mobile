import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Checkbox, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { completeProfileSchema } from "@/lib/schemas/forms";
import { useAuthSessionStore } from "@/store/modules/auth-session";

type ProfileForm = z.infer<typeof completeProfileSchema>;

export default function ProfileOnboardingScreen() {
  const completeProfile = useAuthSessionStore((state) => state.completeProfile);
  const toast = useToast();
  const form = useForm<ProfileForm>({
    defaultValues: { acceptTerms: false, avatarUrl: "", fullName: "" },
    resolver: zodResolver(completeProfileSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileForm) =>
      completeProfile({
        acceptTerms: values.acceptTerms,
        avatarUrl: values.avatarUrl || null,
        fullName: values.fullName,
      }),
    onSuccess: async () => {
      router.replace("/");
    },
    onError: (error) =>
      toast.showToast({
        title: "Profile not saved",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      }),
  });

  return (
    <Screen contentClassName="gap-6">
      <View>
        <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark">
          Complete profile
        </Text>
        <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
          Coaches and athletes see this name on teams, invites, and audit logs.
        </Text>
      </View>

      <Card>
        <CardContent className="gap-4 pt-4">
          <Controller
            control={form.control}
            name="fullName"
            render={({ field, fieldState }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  Full name
                </Text>
                <Input
                  error={fieldState.error?.message}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  placeholder="Jane Doe"
                  value={field.value}
                />
              </View>
            )}
          />
          <Controller
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <View className="flex-row items-center gap-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Text className="flex-1 text-sm text-foreground dark:text-foreground-dark">
                  I accept the RepScript terms for coaching data.
                </Text>
              </View>
            )}
          />
          {form.formState.errors.acceptTerms ? (
            <Text className="text-sm text-destructive">
              {form.formState.errors.acceptTerms.message}
            </Text>
          ) : null}
          <Button
            label="Continue"
            loading={mutation.isPending}
            onPress={form.handleSubmit((values) => mutation.mutate(values))}
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
