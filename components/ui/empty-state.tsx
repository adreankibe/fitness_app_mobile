import React from "react";
import { Text, View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type EmptyStateIcon = React.ComponentType<{
  color?: string;
  size?: number;
  strokeWidth?: number;
}>;

type EmptyStateProps = ViewProps & {
  icon: EmptyStateIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  action,
  className,
  description,
  icon: Icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <View
      className={cn("flex-1 items-center justify-center px-6 py-12", className)}
      {...props}
    >
      <Icon color="#94a3b8" size={48} strokeWidth={1.75} />
      <Text className="mt-4 text-center text-lg font-semibold text-foreground dark:text-foreground-dark">
        {title}
      </Text>
      <Text className="mt-2 max-w-xs text-center text-sm text-muted-foreground dark:text-muted-foreground-dark">
        {description}
      </Text>
      {action ? <View className="mt-6">{action}</View> : null}
    </View>
  );
}
