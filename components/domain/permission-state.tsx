import { ShieldAlert } from "lucide-react-native";
import React from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { hasAnyPermission } from "@/lib/permissions/access";
import { useOrganizationStore } from "@/store/modules/organization";

type PermissionStateProps = React.PropsWithChildren<{
  permissions: string[];
  fallbackTitle?: string;
}>;

export function PermissionState({
  children,
  fallbackTitle = "Permission needed",
  permissions,
}: PermissionStateProps) {
  const current = useOrganizationStore((state) => state.permissions);

  if (!hasAnyPermission(current, permissions)) {
    return (
      <EmptyState
        description="Your current organization role cannot access this area."
        icon={ShieldAlert}
        title={fallbackTitle}
      />
    );
  }

  return <>{children}</>;
}
