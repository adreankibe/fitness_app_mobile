import React from "react";
import { ScrollView, View, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/lib/utils/cn";

type ScreenProps = ScrollViewProps & {
  scroll?: boolean;
  contentClassName?: string;
};

export function Screen({
  children,
  className,
  contentClassName,
  scroll = true,
  ...props
}: ScreenProps) {
  if (!scroll) {
    return (
      <SafeAreaView
        className={cn("flex-1 bg-background dark:bg-background-dark", className)}
      >
        <View className={cn("flex-1", contentClassName)}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={cn("flex-1 bg-background dark:bg-background-dark", className)}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName={cn("gap-4 p-6", contentClassName)}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
