import React from "react";
import {
  Image,
  Text,
  View,
  type ImageProps,
  type TextProps,
  type ViewProps,
} from "react-native";

import { cn } from "@/lib/utils/cn";

type AvatarSize = "sm" | "default" | "lg";

const AvatarSizeContext = React.createContext<AvatarSize>("default");

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-6",
  default: "size-8",
  lg: "size-10",
};

const fallbackTextClasses: Record<AvatarSize, string> = {
  sm: "text-xs",
  default: "text-sm",
  lg: "text-base",
};

type AvatarProps = ViewProps & {
  size?: AvatarSize;
  className?: string;
};

export function Avatar({
  children,
  className,
  size = "default",
  ...props
}: AvatarProps) {
  return (
    <AvatarSizeContext.Provider value={size}>
      <View
        className={cn(
          "items-center justify-center overflow-hidden rounded-full bg-primary",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </View>
    </AvatarSizeContext.Provider>
  );
}

export function AvatarImage({ className, ...props }: ImageProps) {
  return (
    <Image
      className={cn("size-full rounded-full", className)}
      resizeMode="cover"
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: TextProps) {
  const size = React.useContext(AvatarSizeContext);

  return (
    <Text
      className={cn(
        "font-medium text-primary-foreground",
        fallbackTextClasses[size],
        className,
      )}
      {...props}
    />
  );
}
