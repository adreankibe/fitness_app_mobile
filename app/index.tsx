import { Redirect } from "expo-router";
import React from "react";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { resolveInitialRoute } from "@/lib/navigation/route-decisions";
import { useAuth } from "@/components/providers/auth-provider";
import { useAuthMe } from "@/hooks/queries/useAuthMe";

export default function IndexScreen() {
  const auth = useAuth();
  const user = useAuthMe(Boolean(auth.session));
  const href = resolveInitialRoute(
    auth.isLoading || user.isLoading,
    Boolean(auth.session),
    user.data,
  );

  if (!href) {
    return <RepScriptLoader label="Loading RepScript" />;
  }

  return <Redirect href={href} />;
}
