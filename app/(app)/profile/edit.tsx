import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Input, PageHeader } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useUserMe } from "@/hooks/queries/useUserMe";
import { profileEditSchema } from "@/lib/schemas/forms";
import { useAuthSessionStore } from "@/store/modules/auth-session";
import { useUsersStore } from "@/store/modules/users";

type ProfileEditForm = z.infer<typeof profileEditSchema>;

export default function EditProfileScreen() {
  const updateMe = useUsersStore((state) => state.updateMe);
  const fetchAuthMe = useAuthSessionStore((state) => state.fetchAuthMe);
  const toast = useToast();
  const user = useUserMe();
  const form = useForm<ProfileEditForm>({
    defaultValues: { avatarUrl: "", fullName: "" },
    resolver: zodResolver(profileEditSchema),
  });

  React.useEffect(() => {
    if (user.data) {
      form.reset({
        avatarUrl: user.data.avatarUrl ?? "",
        fullName: user.data.fullName ?? "",
      });
    }
  }, [form, user.data]);

  const mutation = useMutation({
    mutationFn: (values: ProfileEditForm) =>
      updateMe({
        avatarUrl: values.avatarUrl || null,
        fullName: values.fullName,
      }),
    onSuccess: async () => {
      await fetchAuthMe();
      toast.showToast({ title: "Profile saved", variant: "success" });
      router.back();
    },
  });

  return (
    <Screen>
      <PageHeader className="-mx-6 -mt-6" title="Edit profile" />
      <Card>
        <CardContent className="gap-4 pt-4">
          <Controller
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  Full name
                </Text>
                <Input onChangeText={field.onChange} value={field.value} />
              </View>
            )}
          />
          <Controller
            control={form.control}
            name="avatarUrl"
            render={({ field }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  Avatar URL
                </Text>
                <Input
                  autoCapitalize="none"
                  onChangeText={field.onChange}
                  value={field.value}
                />
              </View>
            )}
          />
          <Button
            label="Save"
            loading={mutation.isPending}
            onPress={form.handleSubmit((values) => mutation.mutate(values))}
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
