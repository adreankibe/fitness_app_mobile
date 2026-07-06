import React from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "@/components/domain/role-badge";
import { useOrganizationStore } from "@/store/modules/organization";

export function OrgSwitcher() {
  const activeOrganizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const memberships = useOrganizationStore((state) => state.memberships);
  const setActiveOrganization = useOrganizationStore(
    (state) => state.setActiveOrganization,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizations</CardTitle>
      </CardHeader>
      <CardContent className="gap-3">
        {memberships.map((membership) => {
          const active = membership.organizationId === activeOrganizationId;

          return (
            <View
              className="flex-row items-center justify-between gap-3 rounded-lg border border-border p-3 dark:border-border-dark"
              key={membership.id}
            >
              <View className="min-w-0 flex-1">
                <Text
                  className="text-sm font-semibold text-foreground dark:text-foreground-dark"
                  numberOfLines={1}
                >
                  {membership.organizationName}
                </Text>
                <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                  {active ? "Active organization" : membership.organizationSlug}
                </Text>
              </View>
              <RoleBadge role={membership.role} />
              {!active ? (
                <Button
                  label="Use"
                  onPress={() => setActiveOrganization(membership.organizationId)}
                  size="sm"
                  variant="outline"
                />
              ) : null}
            </View>
          );
        })}
      </CardContent>
    </Card>
  );
}
