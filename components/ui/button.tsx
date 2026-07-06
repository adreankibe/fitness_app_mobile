import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  type PressableProps,
} from "react-native";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "flex-row shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent active:opacity-80 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary",
        outline:
          "border-border bg-transparent dark:border-border-dark dark:bg-transparent",
        secondary: "bg-secondary dark:bg-secondary-dark",
        ghost: "bg-transparent",
        destructive: "bg-destructive",
        link: "bg-transparent",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const labelVariants = cva("text-base font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      outline: "text-foreground dark:text-foreground-dark",
      secondary: "text-secondary-foreground dark:text-secondary-foreground-dark",
      ghost: "text-foreground dark:text-foreground-dark",
      destructive: "text-destructive-foreground",
      link: "text-primary underline",
    },
    size: {
      default: "text-sm font-medium",
      sm: "text-xs font-medium",
      lg: "text-base font-medium",
      icon: "text-sm font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

type ButtonProps = Omit<PressableProps, "children"> &
  VariantProps<typeof buttonVariants> & {
    children?: React.ReactNode;
    label?: string;
    leftIcon?: React.ReactNode;
    loading?: boolean;
    rightIcon?: React.ReactNode;
    className?: string;
    textClassName?: string;
  };

function loadingColor(variant: ButtonProps["variant"]) {
  if (variant === "default" || variant === "destructive") return "#ffffff";
  return "#1b1b41";
}

export function Button({
  children,
  className,
  disabled,
  label,
  leftIcon,
  loading = false,
  rightIcon,
  size,
  textClassName,
  variant,
  ...props
}: ButtonProps) {
  const content = label ?? children;

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={loadingColor(variant)} size="small" />
      ) : null}
      {!loading ? leftIcon : null}
      {typeof content === "string" ? (
        <Text className={cn(labelVariants({ variant, size }), textClassName)}>
          {content}
        </Text>
      ) : (
        content
      )}
      {!loading ? rightIcon : null}
    </Pressable>
  );
}

export { buttonVariants, labelVariants };
