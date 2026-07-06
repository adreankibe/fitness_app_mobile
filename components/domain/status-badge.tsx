import React from "react";

import { Badge } from "@/components/ui/badge";
import { formatEnumLabel } from "@/components/domain/role-badge";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant =
    status === "ACTIVE" || status === "ACCEPTED" || status === "COMPLETED"
      ? "success"
      : status === "PENDING" ||
          status === "PROFILE_INCOMPLETE" ||
          status === "SUSPENDED"
        ? "warning"
        : status === "REVOKED" || status === "MISSED"
          ? "destructive"
          : "secondary";

  return <Badge variant={variant}>{formatEnumLabel(status)}</Badge>;
}
