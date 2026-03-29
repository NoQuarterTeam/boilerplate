import { createFormHook } from "@tanstack/react-form"
import { AlertCircleIcon } from "lucide-react"
import * as React from "react"

import { Alert, AlertDescription } from "@boilerplate/ui/components/alert"
import { Button } from "@boilerplate/ui/components/button"
import { Checkbox } from "@boilerplate/ui/components/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@boilerplate/ui/components/field"
import { Input } from "@boilerplate/ui/components/input"
import { NativeSelect, type NativeSelectProps } from "@boilerplate/ui/components/native-select"
import { Textarea } from "@boilerplate/ui/components/textarea"
import { cn } from "@boilerplate/ui/lib/utils"

import { useFieldContext, useFormContext, fieldContext, formContext } from "./context"

function TextField({
  label,
  placeholder,
  description,
  fieldProps,
  ...rest
}: {
  label: string
  placeholder?: string
  description?: React.ReactNode
  fieldProps?: React.ComponentProps<typeof Field>
} & React.ComponentProps<"input">) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  return (
    <Field {...fieldProps} data-invalid={isInvalid || undefined} className={cn("gap-1", fieldProps?.className)}>
      <FieldContent className="gap-0">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <FieldContent>
        <Input
          id={field.name}
          placeholder={placeholder}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${field.name}-error` : undefined}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          {...rest}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

function TextareaField({
  label,
  placeholder,
  description,
  fieldProps,
  ...rest
}: {
  label: string
  placeholder: string
  description?: React.ReactNode
  fieldProps?: React.ComponentProps<typeof Field>
} & React.ComponentProps<"textarea">) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  return (
    <Field {...fieldProps} data-invalid={isInvalid || undefined} className={cn("gap-1", fieldProps?.className)}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${field.name}-error` : undefined}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        {...rest}
      />
      <FieldContent className="gap-0">
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

function NativeSelectField({
  label,
  description,
  children,
  fieldProps,
  ...rest
}: {
  label: string
  description?: React.ReactNode
  children: React.ReactNode
  fieldProps?: React.ComponentProps<typeof Field>
} & NativeSelectProps) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  return (
    <Field {...fieldProps} data-invalid={isInvalid || undefined} className={cn("gap-1", fieldProps?.className)}>
      <FieldContent className="gap-0">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <FieldContent>
        <NativeSelect
          id={field.name}
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? `${field.name}-error` : undefined}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          className="w-full"
          {...rest}
        >
          {children}
        </NativeSelect>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

function CheckboxField({
  label,
  description,
  fieldProps,
  ...rest
}: { label: string; description?: React.ReactNode; fieldProps?: React.ComponentProps<typeof Field> } & Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange"
>) {
  const field = useFieldContext<boolean>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  return (
    <Field orientation="horizontal" {...fieldProps} data-invalid={isInvalid || undefined}>
      <Checkbox
        id={field.name}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${field.name}-error` : undefined}
        checked={field.state.value}
        onCheckedChange={(checked) => field.handleChange(checked === true)}
        {...rest}
      />
      <FieldContent>
        <FieldLabel htmlFor={field.name} className="cursor-pointer">
          {label}
        </FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

const AsyncSelectField = React.lazy(() => import("./async-select-field.tsx"))
const MultiSelectField = React.lazy(() => import("./multi-select-field.tsx"))
const SelectField = React.lazy(() => import("./select-field.tsx"))

function SubmitButton({
  children,
  ...rest
}: Omit<React.ComponentProps<typeof Button>, "children"> & {
  children: React.ReactNode | ((isSubmitting: boolean) => React.ReactNode)
}) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button
          type="submit"
          {...rest}
          className={cn("w-full", rest.className)}
          disabled={!canSubmit || isSubmitting || rest.disabled}
        >
          {typeof children === "function" ? children(isSubmitting ?? false) : children}
        </Button>
      )}
    </form.Subscribe>
  )
}

function FormError({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return (
    <Alert>
      <AlertCircleIcon />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    NativeSelectField,
    SelectField,
    CheckboxField,
    AsyncSelectField,
    MultiSelectField,
  },
  formComponents: {
    SubmitButton,
    FormError,
  },
})
