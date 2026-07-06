import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";

import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function RegisterScreen() {
  return (
    <Screen contentClassName="flex-grow justify-center gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            RepScript accounts start from a magic link or organization invite.
            Use your email, then finish profile and organization setup.
          </Text>
          <Button
            label="Continue with email"
            leftIcon={<Mail color="#ffffff" size={16} />}
            onPress={() => router.replace("/(auth)/login")}
          />
          <Button
            label="Have an invite code?"
            onPress={() => router.push("/(auth)/onboarding/join-org")}
            variant="outline"
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
