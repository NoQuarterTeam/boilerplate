import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { View, type TextInputProps } from "react-native"

import { Input } from "@/components/input"
import { Text } from "@/components/text"
import { cn } from "@/lib/utils"

import { Button } from "./button"

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

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

function SubmitButton({
  children,
  ...rest
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  children: React.ReactNode | ((isSubmitting: boolean) => React.ReactNode)
}) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting] as const}>
      {([canSubmit, isSubmitting]) => (
        <Button className={cn("mt-", rest.className)} disabled={!canSubmit || isSubmitting || rest.disabled} {...rest}>
          {typeof children === "function" ? children(isSubmitting) : children}
        </Button>
      )}
    </form.Subscribe>
  )
}

function FormError({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <Text className="mt-1 text-sm text-red-700">{children}</Text>
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
  },
  formComponents: {
    SubmitButton,
    FormError,
  },
})
