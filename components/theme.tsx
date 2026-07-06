import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

export function Theme({ children }: React.PropsWithChildren) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar style={isDark ? "light" : "dark"} />
      {children}
    </View>
  );
}
