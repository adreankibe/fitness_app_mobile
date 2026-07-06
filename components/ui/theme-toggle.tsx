import { Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";

import { Button } from "@/components/ui/button";
import { useThemeStore } from "@/store/modules/theme";

export function ThemeToggle() {
  const { colorScheme } = useColorScheme();
  const toggleResolvedMode = useThemeStore((state) => state.toggleResolvedMode);
  const isDark = colorScheme === "dark";

  return (
    <Button
      accessibilityLabel="Toggle color theme"
      onPress={() => toggleResolvedMode(isDark ? "dark" : "light")}
      size="icon"
      variant="ghost"
    >
      {isDark ? (
        <Sun color="#f8fafc" size={18} />
      ) : (
        <Moon color="#171717" size={18} />
      )}
    </Button>
  );
}
