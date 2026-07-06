import { FileText, Search } from "lucide-react-native";
import React from "react";

import { AuditEventRow, PermissionState, RepScriptLoader } from "@/components/domain";
import { Screen } from "@/components/layout/screen";
import { Card, CardContent, EmptyState, Input, PageHeader } from "@/components/ui";
import { useAuditEvents } from "@/hooks/queries/useAuditEvents";

export default function AuditLogScreen() {
  const [action, setAction] = React.useState("");
  const events = useAuditEvents({ action, page: 1, pageSize: 50 });

  return (
    <Screen>
      <PageHeader
        className="-mx-6 -mt-6"
        description="Organization authorization and admin activity."
        title="Audit Log"
      />
      <PermissionState permissions={["audit:list"]}>
        <Input
          leftIcon={<Search color="#64748b" size={16} />}
          onChangeText={setAction}
          placeholder="Filter by action..."
          value={action}
        />
        {events.isLoading ? <RepScriptLoader label="Loading audit log" /> : null}
        {events.data?.items.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No audit events yet"
            description="Organization changes will appear here."
          />
        ) : null}
        <Card>
          <CardContent className="px-0 py-0">
            {events.data?.items.map((event) => (
              <AuditEventRow event={event} key={event.id} />
            ))}
          </CardContent>
        </Card>
      </PermissionState>
    </Screen>
  );
}
