import React from "react";
import { Text, View, type TextProps, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type CardProps = ViewProps & {
  size?: "default" | "sm";
  className?: string;
};

export function Card({
  children,
  className,
  size = "default",
  ...props
}: CardProps) {
  return (
    <View
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card py-4 shadow-sm dark:border-border-dark dark:bg-card-dark",
        size === "sm" ? "gap-3 py-3" : "gap-4",
        className,
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function CardHeader({ className, ...props }: ViewProps) {
  return (
    <View className={cn("gap-1 px-4", className)} {...props} />
  );
}

export function CardTitle({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn(
        "text-lg font-semibold leading-snug text-card-foreground dark:text-card-foreground-dark",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn(
        "text-sm text-muted-foreground dark:text-muted-foreground-dark",
        className,
      )}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: ViewProps) {
  return <View className={cn("self-start", className)} {...props} />;
}

export function CardContent({ className, ...props }: ViewProps) {
  return <View className={cn("px-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        "flex-row items-center border-t border-border bg-muted/50 p-4 dark:border-border-dark dark:bg-muted-dark/50",
        className,
      )}
      {...props}
    />
  );
}
