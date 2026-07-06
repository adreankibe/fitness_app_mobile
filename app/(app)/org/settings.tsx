import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { PermissionState, RepScriptLoader } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Input, PageHeader, Select, Switch } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { queryKeys } from "@/hooks/queries/keys";
import { useCurrentOrganization } from "@/hooks/queries/useOrganizations";
import { organizationSettingsSchema } from "@/lib/schemas/forms";
import { organizationsService } from "@/services/organizations";
import type { OrganizationRole } from "@/types/api";

type SettingsForm = z.infer<typeof organizationSettingsSchema>;

const roleOptions = [
  { label: "Athlete", value: "ATHLETE" },
  { label: "Coach", value: "COACH" },
  { label: "Assistant Coach", value: "ASSISTANT_COACH" },
];

export default function OrganizationSettingsScreen() {
  const organization = useCurrentOrganization();
  const queryClient = useQueryClient();
  const toast = useToast();
  const form = useForm<SettingsForm>({
    defaultValues: {
      allowAthleteSelfJoin: false,
      defaultInviteRole: "ATHLETE",
      name: "",
      requireCoachApprovalForBuyers: true,
      slug: "",
      timezone: "",
    },
    resolver: zodResolver(organizationSettingsSchema),
  });

  React.useEffect(() => {
    if (organization.data) {
      form.reset({
        allowAthleteSelfJoin:
          organization.data.settings.allowAthleteSelfJoin,
        defaultInviteRole:
          organization.data.settings.defaultInviteRole as OrganizationRole,
        name: organization.data.name,
        requireCoachApprovalForBuyers:
          organization.data.settings.requireCoachApprovalForBuyers,
        slug: organization.data.slug,
        timezone: organization.data.settings.timezone,
      });
    }
  }, [form, organization.data]);

  const mutation = useMutation({
    mutationFn: async (values: SettingsForm) => {
      await organizationsService.update({
        name: values.name,
        slug: values.slug,
      });
      return organizationsService.updateSettings({
        allowAthleteSelfJoin: values.allowAthleteSelfJoin,
        defaultInviteRole: values.defaultInviteRole as OrganizationRole,
        requireCoachApprovalForBuyers: values.requireCoachApprovalForBuyers,
        timezone: values.timezone,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.currentOrganization(null).slice(0, 2),
      });
      toast.showToast({ title: "Settings saved", variant: "success" });
    },
  });

  if (organization.isLoading) {
    return <RepScriptLoader label="Loading settings" />;
  }

  return (
    <Screen>
      <PageHeader className="-mx-6 -mt-6" title="Organization Settings" />
      <PermissionState permissions={["org:update"]}>
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
                  <Input onChangeText={field.onChange} value={field.value} />
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
                  <Input onChangeText={field.onChange} value={field.value} />
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
            <Controller
              control={form.control}
              name="defaultInviteRole"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  options={roleOptions}
                  value={field.value}
                />
              )}
            />
            <Controller
              control={form.control}
              name="allowAthleteSelfJoin"
              render={({ field }) => (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-foreground dark:text-foreground-dark">
                    Allow self-join
                  </Text>
                  <Switch onValueChange={field.onChange} value={field.value} />
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="requireCoachApprovalForBuyers"
              render={({ field }) => (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-foreground dark:text-foreground-dark">
                    Require coach approval
                  </Text>
                  <Switch onValueChange={field.onChange} value={field.value} />
                </View>
              )}
            />
            <Button
              label="Save settings"
              loading={mutation.isPending}
              onPress={form.handleSubmit((values) => mutation.mutate(values))}
            />
          </CardContent>
        </Card>
      </PermissionState>
    </Screen>
  );
}
