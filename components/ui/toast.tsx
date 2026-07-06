import React from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils/cn";

type ToastVariant = "default" | "success" | "destructive";

type ToastPayload = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastContextValue = {
  showToast: (toast: ToastPayload) => void;
  hideToast: () => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const toastClassByVariant: Record<ToastVariant, string> = {
  default: "border-border bg-card dark:border-border-dark dark:bg-card-dark",
  success:
    "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950",
  destructive:
    "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950",
};

const toastTextClassByVariant: Record<ToastVariant, string> = {
  default: "text-card-foreground dark:text-card-foreground-dark",
  success: "text-green-900 dark:text-green-100",
  destructive: "text-red-900 dark:text-red-100",
};

export function ToastProvider({ children }: React.PropsWithChildren) {
  const [toast, setToast] = React.useState<ToastPayload | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setToast(null);
  }, []);

  const showToast = React.useCallback(
    (nextToast: ToastPayload) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setToast(nextToast);
      timeoutRef.current = setTimeout(
        hideToast,
        nextToast.durationMs ?? 3500,
      );
    },
    [hideToast],
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const variant = toast?.variant ?? "default";

  return (
    <ToastContext.Provider value={{ hideToast, showToast }}>
      <View className="flex-1">
        {children}
        {toast ? (
          <Pressable
            accessibilityRole="button"
            className={cn(
              "absolute bottom-6 left-4 right-4 rounded-xl border p-4 shadow-md",
              toastClassByVariant[variant],
            )}
            onPress={hideToast}
          >
            <Text
              className={cn(
                "text-sm font-semibold",
                toastTextClassByVariant[variant],
              )}
            >
              {toast.title}
            </Text>
            {toast.description ? (
              <Text
                className={cn(
                  "mt-1 text-sm",
                  toastTextClassByVariant[variant],
                )}
              >
                {toast.description}
              </Text>
            ) : null}
          </Pressable>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

export function confirmDestructive({
  confirmText = "Confirm",
  message,
  onConfirm,
  title,
}: {
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
}) {
  Alert.alert(title, message, [
    { text: "Cancel", style: "cancel" },
    { text: confirmText, onPress: onConfirm, style: "destructive" },
  ]);
}
