import React from "react";
import { View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

export function Skeleton({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("rounded-md bg-muted dark:bg-muted-dark", className)}
      {...props}
    />
  );
}
