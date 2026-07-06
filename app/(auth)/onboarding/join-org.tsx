import { router } from "expo-router";
import { Ticket } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";

import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { toInvitePreviewRoute } from "@/lib/navigation/route-decisions";

export default function JoinOrganizationScreen() {
  const [token, setToken] = React.useState("");
  const trimmedToken = token.trim();

  return (
    <Screen contentClassName="flex-grow justify-center gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Join organization</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
            Paste the invite code from your coach. We will preview the gym and
            role before accepting.
          </Text>
          <Input
            autoCapitalize="none"
            leftIcon={<Ticket color="#64748b" size={16} />}
            onChangeText={setToken}
            placeholder="Invite code"
            value={token}
          />
          <Button
            disabled={!trimmedToken}
            label="Preview invite"
            onPress={() => router.push(toInvitePreviewRoute(trimmedToken))}
          />
          <Button
            label="Create organization instead"
            onPress={() => router.replace("/(auth)/onboarding/create-org")}
            variant="ghost"
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
