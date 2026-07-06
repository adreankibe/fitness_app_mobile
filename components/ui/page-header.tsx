import React from "react";
import { Text, View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type PageHeaderProps = ViewProps & {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  actions,
  className,
  description,
  title,
  ...props
}: PageHeaderProps) {
  return (
    <View
      className={cn(
        "gap-4 border-b border-border px-6 pb-3 pt-6 dark:border-border-dark",
        className,
      )}
      {...props}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="min-w-0 flex-1">
          <Text className="text-3xl font-bold text-foreground dark:text-foreground-dark">
            {title}
          </Text>
          {description ? (
            <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {description}
            </Text>
          ) : null}
        </View>
        {actions ? <View className="shrink-0">{actions}</View> : null}
      </View>
    </View>
  );
}
