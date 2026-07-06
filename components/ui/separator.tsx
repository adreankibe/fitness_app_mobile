import React from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type SeparatorProps = ViewProps & {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) {
  return (
    <View
      className={cn(
        "bg-border dark:bg-border-dark",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}
