import { Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding/profile" />
      <Stack.Screen name="onboarding/create-org" />
      <Stack.Screen name="invite/[token]" />
    </Stack>
  );
}
