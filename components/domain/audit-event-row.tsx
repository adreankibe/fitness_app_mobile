import React from "react";

import { ListRow } from "@/components/ui/list-row";
import type { AuditEvent } from "@/types/api";

type AuditEventRowProps = {
  event: AuditEvent;
};

export function AuditEventRow({ event }: AuditEventRowProps) {
  return (
    <ListRow
      description={`${event.targetType}${event.createdAt ? ` · ${new Date(event.createdAt).toLocaleString()}` : ""}`}
      title={event.action}
    />
  );
}
