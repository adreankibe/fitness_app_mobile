import React from "react";
import { Text, View, type TextProps, type ViewProps } from "react-native";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/utils/cn";

export const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const { formState, getFieldState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField must be used within <FormField>");
  }

  return {
    name: fieldContext.name,
    ...getFieldState(fieldContext.name, formState),
  };
}

export function FormItem({ className, ...props }: ViewProps) {
  return <View className={cn("gap-2", className)} {...props} />;
}

export function FormLabel({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn(
        "text-sm font-medium leading-none text-foreground dark:text-foreground-dark",
        className,
      )}
      {...props}
    />
  );
}

export function FormControl({ className, ...props }: ViewProps) {
  return <View className={cn("gap-2", className)} {...props} />;
}

export function FormDescription({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn(
        "text-xs text-muted-foreground dark:text-muted-foreground-dark",
        className,
      )}
      {...props}
    />
  );
}

export function FormMessage({ children, className, ...props }: TextProps) {
  const { error } = useFormField();
  const body = children ?? error?.message;

  if (!body) return null;

  return (
    <Text
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </Text>
  );
}
