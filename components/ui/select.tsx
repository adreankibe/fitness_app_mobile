import { Check, ChevronDown } from "lucide-react-native";
import React from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  type PressableProps,
} from "react-native";

import { cn } from "@/lib/utils/cn";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = Omit<PressableProps, "children" | "onPress"> & {
  value?: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function Select({
  className,
  disabled = false,
  onValueChange,
  options,
  placeholder = "Select option",
  value,
  ...props
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        className={cn(
          "h-10 flex-row items-center justify-between rounded-lg border border-input bg-transparent px-3",
          "dark:border-input-dark",
          disabled && "bg-muted/50 opacity-50 dark:bg-muted-dark/50",
          className,
        )}
        disabled={disabled}
        onPress={() => setOpen(true)}
        {...props}
      >
        <Text
          className={cn(
            "text-base",
            selected
              ? "text-foreground dark:text-foreground-dark"
              : "text-muted-foreground dark:text-muted-foreground-dark",
          )}
        >
          {selected?.label ?? placeholder}
        </Text>
        <ChevronDown color="#64748b" size={16} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setOpen(false)}
        transparent
        visible={open}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setOpen(false)}
        >
          <Pressable className="rounded-t-2xl bg-card p-4 dark:bg-card-dark">
            <Text className="mb-3 text-lg font-semibold text-card-foreground dark:text-card-foreground-dark">
              {placeholder}
            </Text>
            <View className="gap-1">
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <Pressable
                    className="h-11 flex-row items-center justify-between rounded-lg px-3 active:bg-muted dark:active:bg-muted-dark"
                    key={option.value}
                    onPress={() => {
                      onValueChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Text className="text-base text-foreground dark:text-foreground-dark">
                      {option.label}
                    </Text>
                    {active ? <Check color="#1b1b41" size={18} /> : null}
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
