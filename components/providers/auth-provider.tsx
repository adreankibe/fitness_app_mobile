import type { Session } from "@supabase/supabase-js";
import React from "react";

import { supabase } from "@/lib/supabase/client";

type AuthContextValue = {
  isLoading: boolean;
  session: Session | null;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session);
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = React.useMemo(
    () => ({ isLoading, session }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = React.useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
