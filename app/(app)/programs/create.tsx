import { router } from "expo-router";
import { Dumbbell } from "lucide-react-native";
import React from "react";
import { Text } from "react-native";

import { Screen } from "@/components/layout/screen";
import { Button, Card, CardContent, Input, PageHeader, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/toast";

export default function CreateProgramScreen() {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const toast = useToast();

  return (
    <Screen contentClassName="gap-4">
      <PageHeader
        className="-mx-6 -mt-6"
        description="Sketch a training block before publishing it to athletes."
        title="Create Program"
      />

      <Card>
        <CardContent className="gap-4 pt-4">
          <Input
            leftIcon={<Dumbbell color="#64748b" size={16} />}
            onChangeText={setTitle}
            placeholder="Program title"
            value={title}
          />
          <Textarea
            onChangeText={setDescription}
            placeholder="Block goal, progression rules, coach notes"
            value={description}
          />
          <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
            Program persistence waits on a backend create endpoint. This route
            keeps the navigation and builder surface ready without faking saved data.
          </Text>
          <Button
            disabled={!title.trim() || !description.trim()}
            label="Save draft"
            onPress={() => {
              toast.showToast({
                title: "Draft captured",
                description: "Connect POST /v1/programs to persist this block.",
                variant: "success",
              });
              router.back();
            }}
          />
        </CardContent>
      </Card>
    </Screen>
  );
}
