import { router } from "expo-router";
import { Search, UserPlus } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

import { MemberRow, PermissionState, RepScriptLoader } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import {
  Button,
  Card,
  CardContent,
  EmptyState,
  HeaderAction,
  Input,
  PageHeader,
} from "@/components/ui";
import { useMembers } from "@/hooks/queries/useMembers";
import { hasPermission } from "@/lib/permissions/access";
import { useOrganizationStore } from "@/store/modules/organization";

export default function MembersScreen() {
  const [q, setQ] = React.useState("");
  const permissions = useOrganizationStore((state) => state.permissions);
  const members = useMembers({ q, page: 1, pageSize: 50 });

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        actions={
          hasPermission(permissions, "invites:create") ? (
            <HeaderAction
              icon={UserPlus}
              label="Invite member"
              onPress={() => router.push("/(app)/members/invite")}
            />
          ) : null
        }
        className="-mx-6 -mt-6"
        description="Search athletes, coaches, and owners."
        title="Members"
      />

      <PermissionState permissions={["members:list"]}>
        <Input
          leftIcon={<Search color="#64748b" size={16} />}
          onChangeText={setQ}
          placeholder="Search members..."
          value={q}
        />

        {members.isLoading ? <RepScriptLoader label="Loading members" /> : null}

        {!members.isLoading && members.data?.items.length === 0 ? (
          <EmptyState
            action={
              hasPermission(permissions, "invites:create") ? (
                <Button
                  label="Invite member"
                  onPress={() => router.push("/(app)/members/invite")}
                />
              ) : null
            }
            icon={UserPlus}
            title="Rack is empty"
            description="Invite the first athlete or coach to this organization."
          />
        ) : null}

        <Card>
          <CardContent className="px-0 py-0">
            {members.data?.items.map((member) => (
              <MemberRow key={member.membershipId} member={member} />
            ))}
          </CardContent>
        </Card>

        {members.error ? (
          <View className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
            <Text className="text-sm text-destructive">
              Members did not load.
            </Text>
          </View>
        ) : null}
      </PermissionState>
    </Screen>
  );
}
