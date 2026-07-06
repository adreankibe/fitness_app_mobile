import { useMutation } from "@tanstack/react-query";
import { MailCheck } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { RoleBadge, StatusBadge } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, EmptyState, PageHeader } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useInvitations } from "@/hooks/queries/useInvitations";
import { useInvitationsStore } from "@/store/modules/invitations";

export default function ManageInvitesScreen() {
  const invitations = useInvitations({ status: "PENDING" });
  const resendInvitation = useInvitationsStore((state) => state.resendInvitation);
  const revokeInvitation = useInvitationsStore((state) => state.revokeInvitation);
  const toast = useToast();

  const resend = useMutation({
    mutationFn: resendInvitation,
    onSuccess: async () => {
      await invitations.refetch();
      toast.showToast({ title: "Invite resent", variant: "success" });
    },
  });

  const revoke = useMutation({
    mutationFn: revokeInvitation,
    onSuccess: async () => {
      await invitations.refetch();
      toast.showToast({ title: "Invite revoked", variant: "success" });
    },
  });

  const items = invitations.data?.items ?? [];

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description="Track and clean up pending organization invitations."
        title="Manage Invites"
      />

      {!invitations.isLoading && items.length === 0 ? (
        <EmptyState
          icon={MailCheck}
          title="No pending invites"
          description="Invite rows appear here until accepted, expired, or revoked."
        />
      ) : null}

      <View className="gap-3">
        {items.map((invite) => (
          <Card key={invite.id}>
            <CardContent className="gap-3 pt-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="min-w-0 flex-1">
                  <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
                    {invite.email ?? "Open invite link"}
                  </Text>
                  <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                    Expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </Text>
                </View>
                <StatusBadge status={invite.status} />
              </View>
              <RoleBadge role={invite.role} />
              <View className="flex-row gap-2">
                <Button
                  label="Resend"
                  loading={resend.isPending}
                  onPress={() => resend.mutate(invite.id)}
                  size="sm"
                  variant="secondary"
                />
                <Button
                  label="Revoke"
                  loading={revoke.isPending}
                  onPress={() => revoke.mutate(invite.id)}
                  size="sm"
                  variant="destructive"
                />
              </View>
            </CardContent>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
