import { Redirect } from "expo-router";
import React from "react";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { resolveInitialRoute } from "@/lib/navigation/route-decisions";
import { useAuth } from "@/components/providers/auth-provider";

export default function IndexScreen() {
  const auth = useAuth();
  const href = resolveInitialRoute(
    auth.isLoading,
    Boolean(auth.session),
    auth.currentUser,
  );

  if (!href) {
    return <RepScriptLoader label="Loading RepScript" />;
  }

  return <Redirect href={href} />;
}
