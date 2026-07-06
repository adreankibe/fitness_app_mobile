import React from "react";
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";

import { cn } from "@/lib/utils/cn";

type InputProps = TextInputProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
};

export function Input({
  className,
  containerClassName,
  disabled = false,
  editable,
  error,
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  const [focused, setFocused] = React.useState(false);

  return (
    <View className={cn("gap-2", containerClassName)}>
      <View
        className={cn(
          "h-10 w-full flex-row items-center rounded-lg border border-input bg-transparent px-3",
          "dark:border-input-dark",
          focused && "border-ring",
          error && "border-destructive",
          disabled && "bg-muted/50 opacity-50 dark:bg-muted-dark/50",
        )}
      >
        {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
        <TextInput
          className={cn(
            "min-w-0 flex-1 py-2 text-base text-foreground dark:text-foreground-dark",
            className,
          )}
          editable={disabled ? false : editable}
          onBlur={(event) => {
            setFocused(false);
            props.onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            props.onFocus?.(event);
          }}
          placeholderTextColor="#64748b"
          {...props}
        />
        {rightIcon ? <View className="ml-2">{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text className="text-sm font-medium text-destructive">{error}</Text>
      ) : null}
    </View>
  );
}

export type InputContainerProps = ViewProps;
