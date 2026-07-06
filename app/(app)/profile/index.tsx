import { router } from "expo-router";
import { FileText, LogOut, Settings, UserPen } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";

import { OrgSwitcher, RoleBadge } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import {
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  ListRow,
  PageHeader,
  ThemeToggle,
} from "@/components/ui";
import { useAuth } from "@/components/providers/auth-provider";
import { useAuthMe } from "@/hooks/queries/useAuthMe";
import { hasPermission } from "@/lib/permissions/access";
import { useOrganizationStore } from "@/store/modules/organization";

function initials(name: string | null | undefined) {
  return (name ?? "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProfileScreen() {
  const auth = useAuth();
  const user = useAuthMe();
  const permissions = useOrganizationStore((state) => state.permissions);

  async function signOut() {
    await auth.signOut();
    router.replace("/(auth)/login");
  }

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        actions={<ThemeToggle />}
        className="-mx-6 -mt-6"
        description="Account, organizations, and workspace settings."
        title="Profile"
      />

      <Card>
        <CardContent className="items-center gap-3 pt-6">
          <Avatar size="lg">
            <AvatarFallback>{initials(user.data?.fullName)}</AvatarFallback>
          </Avatar>
          <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            {user.data?.fullName ?? "RepScript user"}
          </Text>
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            {user.data?.email}
          </Text>
          {user.data?.memberships[0] ? (
            <RoleBadge role={user.data.memberships[0].role} />
          ) : null}
          <Button
            label="Edit profile"
            onPress={() => router.push("/(app)/profile/edit")}
            variant="outline"
          />
        </CardContent>
      </Card>

      <OrgSwitcher />

      <Card>
        <CardContent className="px-0 py-0">
          {hasPermission(permissions, "org:update") ? (
            <ListRow
              leading={<Settings color="#1b1b41" size={18} />}
              onPress={() => router.push("/(app)/org/settings")}
              showChevron
              title="Organization Settings"
            />
          ) : null}
          {hasPermission(permissions, "audit:list") ? (
            <ListRow
              leading={<FileText color="#1b1b41" size={18} />}
              onPress={() => router.push("/(app)/org/audit-log")}
              showChevron
              title="Audit Log"
            />
          ) : null}
          <ListRow
            leading={<UserPen color="#1b1b41" size={18} />}
            onPress={() => router.push("/(app)/profile/edit")}
            showChevron
            title="Edit Profile"
          />
        </CardContent>
      </Card>

      <Button
        label="Sign out"
        leftIcon={<LogOut color="#ef4444" size={16} />}
        onPress={signOut}
        textClassName="text-destructive"
        variant="outline"
      />
    </Screen>
  );
}
