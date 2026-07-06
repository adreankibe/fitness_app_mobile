import React from "react";
import { Text, View, type ViewProps } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@/lib/utils/cn";

type RepScriptLoaderProps = ViewProps & {
  label?: string;
};

export function RepScriptLoader({
  className,
  label = "Loading workout data",
  ...props
}: RepScriptLoaderProps) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * -6 }],
  }));

  return (
    <View
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      className={cn("items-center justify-center gap-3 py-10", className)}
      {...props}
    >
      <View className="h-14 w-32 justify-end">
        <View className="absolute bottom-1 h-0.5 w-full rounded-full bg-border dark:bg-border-dark" />
        <Animated.View
          className="absolute bottom-3 left-3 h-1 w-24 rounded-full bg-primary"
          style={animatedStyle}
        />
        <Animated.View
          className="absolute bottom-1 left-0 h-8 w-3 rounded-sm bg-primary"
          style={animatedStyle}
        />
        <Animated.View
          className="absolute bottom-1 right-0 h-8 w-3 rounded-sm bg-primary"
          style={animatedStyle}
        />
      </View>
      <Text className="text-sm font-medium text-muted-foreground dark:text-muted-foreground-dark">
        {label}
      </Text>
    </View>
  );
}
