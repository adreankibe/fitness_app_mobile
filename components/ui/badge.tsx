import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { Text, View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "self-start rounded-4xl border border-transparent px-2 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary dark:bg-secondary-dark",
        destructive:
          "border-transparent bg-red-100 dark:bg-red-950/50",
        outline: "border-border bg-transparent dark:border-border-dark",
        success: "border-green-200 bg-green-100 dark:border-green-900 dark:bg-green-950/50",
        warning: "border-amber-200 bg-amber-100 dark:border-amber-900 dark:bg-amber-950/50",
        info: "border-blue-200 bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeTextVariants = cva("text-xs font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground dark:text-secondary-foreground-dark",
      destructive: "text-red-700 dark:text-red-300",
      outline: "text-foreground dark:text-foreground-dark",
      success: "text-green-800 dark:text-green-300",
      warning: "text-amber-800 dark:text-amber-300",
      info: "text-blue-800 dark:text-blue-300",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type BadgeProps = ViewProps &
  VariantProps<typeof badgeVariants> & {
    className?: string;
    textClassName?: string;
  };

export function Badge({
  children,
  className,
  textClassName,
  variant,
  ...props
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      <Text className={cn(badgeTextVariants({ variant }), textClassName)}>
        {children}
      </Text>
    </View>
  );
}

export { badgeTextVariants, badgeVariants };
