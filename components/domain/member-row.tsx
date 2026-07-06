import { router } from "expo-router";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ListRow } from "@/components/ui/list-row";
import { RoleBadge } from "@/components/domain/role-badge";
import { StatusBadge } from "@/components/domain/status-badge";
import type { MemberSummary } from "@/types/api";

type MemberRowProps = {
  member: MemberSummary;
};

function initials(name: string | null) {
  return (name ?? "Member")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function MemberRow({ member }: MemberRowProps) {
  return (
    <ListRow
      description={member.email}
      leading={
        <Avatar>
          <AvatarFallback>{initials(member.fullName)}</AvatarFallback>
        </Avatar>
      }
      onPress={() => router.push(`/(app)/members/${member.membershipId}`)}
      showChevron
      title={member.fullName ?? member.email ?? "Unnamed member"}
      trailing={member.status === "ACTIVE" ? <RoleBadge role={member.role} /> : <StatusBadge status={member.status} />}
    />
  );
}
