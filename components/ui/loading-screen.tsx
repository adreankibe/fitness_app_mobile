import React from "react";
import { ActivityIndicator, Text, View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type LoadingScreenProps = ViewProps & {
  label?: string;
};

export function LoadingScreen({
  className,
  label = "Loading...",
  ...props
}: LoadingScreenProps) {
  return (
    <View
      className={cn(
        "flex-1 items-center justify-center gap-4 bg-background dark:bg-background-dark",
        className,
      )}
      {...props}
    >
      <ActivityIndicator color="#1b1b41" size="large" />
      <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
        {label}
      </Text>
    </View>
  );
}
