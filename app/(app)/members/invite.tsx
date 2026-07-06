import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionState } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Input, PageHeader, Select, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { inviteMemberSchema } from "@/lib/schemas/forms";
import { useInvitationsStore } from "@/store/modules/invitations";
import type { OrganizationRole } from "@/types/api";

type InviteForm = z.infer<typeof inviteMemberSchema>;

const roleOptions = [
  { label: "Athlete", value: "ATHLETE" },
  { label: "Coach", value: "COACH" },
  { label: "Assistant Coach", value: "ASSISTANT_COACH" },
];

export default function InviteMemberScreen() {
  const toast = useToast();
  const createInvitation = useInvitationsStore((state) => state.createInvitation);
  const form = useForm<InviteForm>({
    defaultValues: {
      email: "",
      expiresInDays: 14,
      maxRedemptions: 1,
      message: "",
      role: "ATHLETE",
      teamId: "",
    },
    resolver: zodResolver(inviteMemberSchema),
  });

  const mutation = useMutation({
    mutationFn: (values: InviteForm) =>
      createInvitation({
        email: values.email || undefined,
        expiresInDays: values.expiresInDays,
        maxRedemptions: values.maxRedemptions,
        message: values.message,
        role: values.role as OrganizationRole,
        teamId: values.teamId || undefined,
      }),
    onSuccess: async () => {
      toast.showToast({ title: "Invitation sent", variant: "success" });
      router.back();
    },
    onError: (error) =>
      toast.showToast({
        title: "Invite failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      }),
  });

  return (
    <Screen>
      <PageHeader
        className="-mx-6 -mt-6"
        description="Send an invite or create a reusable invite link."
        title="Invite member"
      />
      <PermissionState permissions={["invites:create"]}>
        <Card>
          <CardContent className="gap-4 pt-4">
            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                    Email
                  </Text>
                  <Input
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onChangeText={field.onChange}
                    placeholder="athlete@example.com"
                    value={field.value}
                  />
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <View className="gap-2">
                  <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                    Role
                  </Text>
                  <Select
                    onValueChange={field.onChange}
                    options={roleOptions}
                    value={field.value}
                  />
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="message"
              render={({ field }) => (
                <Textarea
                  onChangeText={field.onChange}
                  placeholder="Optional coach note"
                  value={field.value}
                />
              )}
            />
            <Button
              label="Send invitation"
              loading={mutation.isPending}
              onPress={form.handleSubmit((values) => mutation.mutate(values))}
            />
          </CardContent>
        </Card>
      </PermissionState>
    </Screen>
  );
}
