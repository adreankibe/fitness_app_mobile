import { Check } from "lucide-react-native";
import React from "react";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type CheckboxProps = Omit<PressableProps, "onPress"> & {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function Checkbox({
  checked,
  className,
  disabled,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: Boolean(disabled) }}
      className={cn(
        "size-6 items-center justify-center rounded-md border border-input",
        checked && "border-primary bg-primary",
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled}
      onPress={() => onCheckedChange(!checked)}
      {...props}
    >
      {checked ? <Check color="#ffffff" size={15} strokeWidth={3} /> : null}
    </Pressable>
  );
}
