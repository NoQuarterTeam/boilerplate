import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { View, type TextInputProps } from "react-native"

import { Input } from "@/components/input"
import { Text } from "@/components/text"
import { cn } from "@/lib/utils"

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

function TextField({
  label,
  placeholder,
  description,
  className,
  ...rest
}: {
  label: string
  placeholder?: string
  description?: string
  className?: string
} & Omit<TextInputProps, "value" | "onChange" | "onChangeText" | "onBlur">) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const firstError = field.state.meta.errors[0]
  const errorMessage = !firstError
    ? undefined
    : typeof firstError === "string"
      ? firstError
      : typeof firstError === "object" && "message" in firstError
        ? String(((firstError as { message?: unknown }).message as string) ?? "")
        : undefined

  return (
    <View className={cn("gap-1", className)}>
      <Text className="text-sm font-semibold">{label}</Text>
      {description ? <Text className="text-xs text-muted-foreground">{description}</Text> : null}
      <Input
        placeholder={placeholder}
        isInvalid={isInvalid}
        {...rest}
        value={field.state.value}
        onChangeText={field.handleChange}
        onBlur={field.handleBlur}
      />
      {isInvalid && errorMessage ? <Text className="text-sm text-red-700">{errorMessage}</Text> : null}
    </View>
  )
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {},
})
