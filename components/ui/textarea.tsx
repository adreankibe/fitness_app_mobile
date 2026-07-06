import React from "react";
import {
  TextInput,
  type TextInputProps,
  type ViewProps,
} from "react-native";

import { cn } from "@/lib/utils/cn";

type TextareaProps = TextInputProps & {
  containerClassName?: ViewProps["className"];
  error?: string;
};

export function Textarea({
  className,
  editable = true,
  error,
  placeholderTextColor = "#64748b",
  ...props
}: TextareaProps) {
  return (
    <TextInput
      className={cn(
        "min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-3 text-base text-foreground dark:border-input-dark dark:text-foreground-dark",
        !editable && "bg-muted/50 opacity-50 dark:bg-muted-dark/40",
        error && "border-destructive",
        className,
      )}
      editable={editable}
      multiline
      placeholderTextColor={placeholderTextColor}
      textAlignVertical="top"
      {...props}
    />
  );
}
