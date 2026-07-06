import { Link } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="gap-4 p-6"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="gap-3 rounded-lg border border-border bg-white p-5">
        <Text className="text-xl font-semibold text-foreground">
          Page not found
        </Text>
        <Link href="/" className="text-base font-semibold text-primary">
          Go home
        </Link>
      </View>
    </ScrollView>
  );
}
