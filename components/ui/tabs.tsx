import React from "react";
import { Pressable, Text, View, type ViewProps } from "react-native";

import { cn } from "@/lib/utils/cn";

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used inside <Tabs>");
  return context;
}

type TabsProps = ViewProps & TabsContextValue;

export function Tabs({ children, onValueChange, value, ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ onValueChange, value }}>
      <View {...props}>{children}</View>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex-row gap-1 rounded-lg bg-muted p-1 dark:bg-muted-dark", className)}
      {...props}
    />
  );
}

type TabsTriggerProps = ViewProps & {
  value: string;
  label?: string;
};

export function TabsTrigger({
  children,
  className,
  label,
  value,
  ...props
}: TabsTriggerProps) {
  const tabs = useTabs();
  const active = tabs.value === value;
  const content = label ?? children;

  return (
    <Pressable
      className={cn(
        "h-9 flex-1 items-center justify-center rounded-md px-3",
        active ? "bg-card shadow-sm dark:bg-card-dark" : "bg-transparent",
        className,
      )}
      onPress={() => tabs.onValueChange(value)}
      {...props}
    >
      <Text
        className={cn(
          "text-sm font-medium",
          active
            ? "text-foreground dark:text-foreground-dark"
            : "text-muted-foreground dark:text-muted-foreground-dark",
        )}
      >
        {content}
      </Text>
    </Pressable>
  );
}

type TabsContentProps = ViewProps & {
  value: string;
};

export function TabsContent({
  children,
  value,
  ...props
}: TabsContentProps) {
  const tabs = useTabs();
  if (tabs.value !== value) return null;
  return <View {...props}>{children}</View>;
}
