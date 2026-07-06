import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { z } from "zod";

import { useAuth } from "@/components/providers/auth-provider";
import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email."),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const auth = useAuth();
  const toast = useToast();
  const form = useForm<LoginForm>({
    defaultValues: { email: "" },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginForm) {
    try {
      await auth.signInWithEmail(values.email);
      toast.showToast({
        title: "Check your email",
        description: "Open the magic link on this device to continue.",
        variant: "success",
      });
    } catch (error) {
      toast.showToast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Try again.",
        variant: "destructive",
      });
    }
  }

  React.useEffect(() => {
    if (auth.session) {
      router.replace("/");
    }
  }, [auth.session]);

  return (
    <Screen contentClassName="flex-grow justify-center gap-6">
      <View>
        <Text className="text-4xl font-bold text-foreground dark:text-foreground-dark">
          RepScript
        </Text>
        <Text className="mt-2 text-base text-muted-foreground dark:text-muted-foreground-dark">
          Strength coaching, athletes, and teams in one mobile workspace.
        </Text>
      </View>

      <Card>
        <CardContent className="gap-4 pt-4">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  Email
                </Text>
                <Input
                  autoCapitalize="none"
                  autoComplete="email"
                  error={fieldState.error?.message}
                  keyboardType="email-address"
                  leftIcon={<Mail color="#64748b" size={16} />}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  placeholder="coach@example.com"
                  value={field.value}
                />
                {fieldState.error ? (
                  <Text className="text-sm text-destructive">
                    {fieldState.error.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
          <Button
            label="Send magic link"
            loading={form.formState.isSubmitting}
            onPress={form.handleSubmit(onSubmit)}
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
