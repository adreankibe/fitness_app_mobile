import { ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type ListRowProps = PressableProps & {
  title: string;
  description?: string | null;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  showChevron?: boolean;
};

export function ListRow({
  className,
  description,
  leading,
  showChevron,
  title,
  trailing,
  ...props
}: ListRowProps) {
  return (
    <Pressable
      className={cn(
        "min-h-16 flex-row items-center gap-3 border-b border-border px-4 py-3 dark:border-border-dark",
        className,
      )}
      {...props}
    >
      {leading}
      <View className="min-w-0 flex-1">
        <Text
          className="text-sm font-semibold text-foreground dark:text-foreground-dark"
          numberOfLines={1}
        >
          {title}
        </Text>
        {description ? (
          <Text
            className="mt-0.5 text-xs text-muted-foreground dark:text-muted-foreground-dark"
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
      </View>
      {trailing}
      {showChevron ? <ChevronRight color="#64748b" size={18} /> : null}
    </Pressable>
  );
}
