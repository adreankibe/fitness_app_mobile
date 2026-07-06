import type { CurrentUser } from "@/types/api";

export type AppRoute =
  | "/(auth)/login"
  | "/(auth)/onboarding/profile"
  | "/(auth)/onboarding/create-org"
  | "/(app)/dashboard";

export function resolveInitialRoute(
  isLoading: boolean,
  hasSession: boolean,
  user: CurrentUser | null | undefined,
): AppRoute | null {
  if (isLoading) {
    return null;
  }

  if (!hasSession) {
    return "/(auth)/login";
  }

  if (!user) {
    return null;
  }

  switch (user.nextAction) {
    case "COMPLETE_PROFILE":
      return "/(auth)/onboarding/profile";
    case "CREATE_OR_JOIN_ORGANIZATION":
    case "SELECT_ORGANIZATION":
      return "/(auth)/onboarding/create-org";
    case "CONTACT_SUPPORT":
    case "CONTINUE":
    default:
      return "/(app)/dashboard";
  }
}

export function toInvitePreviewRoute(token: string) {
  return `/(auth)/invite/${encodeURIComponent(token)}` as const;
}
