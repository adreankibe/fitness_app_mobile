import React from "react";

import { Badge } from "@/components/ui/badge";

type RoleBadgeProps = {
  role: string;
};

export function formatEnumLabel(value: string | null | undefined) {
  if (!value) {
    return "Unknown";
  }

  return value
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const variant =
    role === "OWNER" ? "default" : role.includes("COACH") ? "info" : "secondary";

  return <Badge variant={variant}>{formatEnumLabel(role)}</Badge>;
}
