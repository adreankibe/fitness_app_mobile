import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { RoleBadge } from "@/components/domain/role-badge";
import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { StatusBadge } from "@/components/domain/status-badge";
import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { queryKeys } from "@/hooks/queries/keys";
import { useInvitationPreview } from "@/hooks/queries/useInvitations";
import { invitationsService } from "@/services/invitations";

export default function InviteScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const preview = useInvitationPreview(token);
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: () => invitationsService.accept(token, false),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.authMe });
      router.replace("/");
    },
    onError: (error) =>
      toast.showToast({
        title: "Invite not accepted",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      }),
  });

  if (preview.isLoading) {
    return <RepScriptLoader label="Loading invite" />;
  }

  const data = preview.data;

  return (
    <Screen contentClassName="flex-grow justify-center gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Join {data?.organizationName ?? "organization"}</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            This invite adds you to the coaching workspace.
          </Text>
          <View className="flex-row gap-2">
            {data ? <RoleBadge role={data.role} /> : null}
            {data ? <StatusBadge status={data.status} /> : null}
          </View>
          <Button
            disabled={!data || data.status !== "PENDING"}
            label="Accept invite"
            loading={mutation.isPending}
            onPress={() => mutation.mutate()}
          />
          <Button
            label="Back to login"
            onPress={() => router.replace("/(auth)/login")}
            variant="ghost"
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
