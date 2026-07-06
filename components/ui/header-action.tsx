import type { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type HeaderActionProps = PressableProps & {
  icon: LucideIcon;
  label: string;
};

export function HeaderAction({
  className,
  icon: Icon,
  label,
  ...props
}: HeaderActionProps) {
  return (
    <Pressable
      accessibilityLabel={label}
      className={cn(
        "size-10 items-center justify-center rounded-lg border border-border bg-card dark:border-border-dark dark:bg-card-dark",
        className,
      )}
      {...props}
    >
      <Icon color="#1b1b41" size={18} />
    </Pressable>
  );
}
