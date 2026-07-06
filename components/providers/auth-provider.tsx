import type { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import React from "react";

import { useToast } from "@/components/ui/toast";
import { configureApiClientHandlers } from "@/http/client";
import { useAuthMe } from "@/hooks/queries/useAuthMe";
import { queryClient } from "@/lib/query/client";
import { supabase } from "@/lib/supabase/client";
import { useAuthSessionStore } from "@/store/modules/auth-session";
import { useOrganizationStore } from "@/store/modules/organization";
import type {
  CurrentUser,
  CurrentUserMembership,
  RegistrationNextAction,
} from "@/types/api";

export type AuthDataSnapshot = {
  currentUser: CurrentUser | null;
  registrationStatus: string | null;
  nextAction: RegistrationNextAction | null;
  memberships: CurrentUserMembership[];
  permissions: string[];
};

type AuthContextValue = {
  isLoading: boolean;
  session: Session | null;
  currentUser: CurrentUser | null;
  registrationStatus: string | null;
  nextAction: RegistrationNextAction | null;
  memberships: CurrentUserMembership[];
  permissions: string[];
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function createAuthDataSnapshot(
  currentUser: CurrentUser | null | undefined,
  permissions: string[],
): AuthDataSnapshot {
  return {
    currentUser: currentUser ?? null,
    memberships: currentUser?.memberships ?? [],
    nextAction: currentUser?.nextAction ?? null,
    permissions,
    registrationStatus: currentUser?.registrationStatus ?? null,
  };
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [session, setSession] = React.useState<Session | null>(null);
  const permissions = useOrganizationStore((state) => state.permissions);
  const resetOrganization = useOrganizationStore((state) => state.reset);
  const resetAuthSession = useAuthSessionStore((state) => state.resetStore);
  const authMe = useAuthMe(Boolean(session));

  React.useEffect(() => {
    return configureApiClientHandlers({
      onForbidden: (error) => {
        showToast({
          title: "Permission denied",
          description: error.message,
          variant: "destructive",
        });
      },
      onNetworkError: (error) => {
        showToast({
          title: "Connection issue",
          description: error.message,
          variant: "destructive",
        });
      },
      onUnauthorized: async () => {
        resetOrganization();
        resetAuthSession();
        queryClient.clear();
        await supabase.auth.signOut();
        router.replace("/(auth)/login");
      },
    });
  }, [resetAuthSession, resetOrganization, showToast]);

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

  const authData = createAuthDataSnapshot(authMe.data, permissions);
  const isProfileLoading = Boolean(session) && authMe.isLoading;

  const value = React.useMemo(
    () => ({
      ...authData,
      isLoading: isLoading || isProfileLoading,
      session,
      signInWithEmail: async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
          email,
        });

        if (error) {
          throw error;
        }
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        resetOrganization();
        resetAuthSession();
        queryClient.clear();
      },
    }),
    [authData, isLoading, isProfileLoading, resetAuthSession, resetOrganization, session],
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
