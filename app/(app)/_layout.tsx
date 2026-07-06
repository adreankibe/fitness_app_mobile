import { Redirect, Tabs } from "expo-router";
import { LayoutDashboard, UserCircle, Users, UsersRound } from "lucide-react-native";
import React from "react";

import { RepScriptLoader } from "@/components/domain/repscript-loader";
import { useAuth } from "@/components/providers/auth-provider";

export default function AppLayout() {
  const { isLoading, session } = useAuth();

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
          title: "Members",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="members/teams/index"
        options={{
          title: "Teams",
          tabBarIcon: ({ color, size }) => (
            <UsersRound color={color} size={size} />
          ),
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
      <Tabs.Screen name="members/teams/[id]" options={{ href: null }} />
      <Tabs.Screen name="members/teams/create" options={{ href: null }} />
      <Tabs.Screen name="org/settings" options={{ href: null }} />
      <Tabs.Screen name="org/audit-log" options={{ href: null }} />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
    </Tabs>
  );
}
