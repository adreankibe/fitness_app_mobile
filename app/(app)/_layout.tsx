import { Redirect, Tabs } from "expo-router";
import {
  Dumbbell,
  LayoutDashboard,
  Timer,
  UserCircle,
  Users,
} from "lucide-react-native";
import React from "react";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { useAuth } from "@/components/providers/auth-provider";
import { getActiveMembership } from "@/lib/permissions/access";
import { useOrganizationStore } from "@/store/modules/organization";

export default function AppLayout() {
  const { isLoading, session } = useAuth();
  const activeOrganizationId = useOrganizationStore(
    (state) => state.activeOrganizationId,
  );
  const memberships = useOrganizationStore((state) => state.memberships);
  const activeMembership = getActiveMembership(memberships, activeOrganizationId);
  const athleteOnly =
    activeMembership?.role === "ATHLETE" || activeMembership?.role === "TRIAL_USER";

  if (isLoading) {
    return <RepScriptLoader label="Checking session" />;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1b1b41",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          borderTopColor: "#e4e7ec",
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="members/index"
        options={{
          href: athleteOnly ? null : undefined,
          title: "Members",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="programs/index"
        options={{
          title: "Programs",
          tabBarIcon: ({ color, size }) => <Dumbbell color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="workouts/index"
        options={{
          href: athleteOnly ? undefined : null,
          title: "Workouts",
          tabBarIcon: ({ color, size }) => <Timer color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <UserCircle color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen name="members/[id]" options={{ href: null }} />
      <Tabs.Screen name="members/invite" options={{ href: null }} />
      <Tabs.Screen name="members/teams/index" options={{ href: null }} />
      <Tabs.Screen name="members/teams/[id]" options={{ href: null }} />
      <Tabs.Screen name="members/teams/create" options={{ href: null }} />
      <Tabs.Screen name="athletes/index" options={{ href: null }} />
      <Tabs.Screen name="athletes/[id]" options={{ href: null }} />
      <Tabs.Screen
        name="athletes/[id]/workout/[logId]"
        options={{ href: null }}
      />
      <Tabs.Screen name="programs/[id]" options={{ href: null }} />
      <Tabs.Screen name="programs/[id]/week/[weekId]" options={{ href: null }} />
      <Tabs.Screen name="programs/create" options={{ href: null }} />
      <Tabs.Screen
        name="programs/[id]/session/[sessionId]"
        options={{ href: null }}
      />
      <Tabs.Screen name="workouts/[id]" options={{ href: null }} />
      <Tabs.Screen name="workouts/history" options={{ href: null }} />
      <Tabs.Screen name="org/settings" options={{ href: null }} />
      <Tabs.Screen name="org/audit-log" options={{ href: null }} />
      <Tabs.Screen name="org/invite/manage" options={{ href: null }} />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
    </Tabs>
  );
}
