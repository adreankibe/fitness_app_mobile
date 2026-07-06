import "../global.css";

import { Stack } from "expo-router";
import React from "react";

import { AppProviders } from "@/components/providers/app-providers";
import { Theme } from "@/components/theme";

export default function RootLayout() {
  return (
    <AppProviders>
      <Theme>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Fitness Coaching" }} />
          <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
        </Stack>
      </Theme>
    </AppProviders>
  );
}
