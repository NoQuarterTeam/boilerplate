import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@boilerplate/ui/components/field"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@boilerplate/ui/components/select"
import { cn } from "@boilerplate/ui/lib/utils"

import { useFieldContext } from "./context"

export function SelectField({
  label,
  description,
  placeholder,
  children,
  fieldProps,
  ...rest
}: {
  label: string
  placeholder?: string
  description?: React.ReactNode
  children: React.ReactNode
  fieldProps?: React.ComponentProps<typeof Field>
} & React.ComponentProps<typeof Select>) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  return (
    <Field {...fieldProps} data-invalid={isInvalid || undefined} className={cn("gap-1", fieldProps?.className)}>
      <FieldContent className="gap-0">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <FieldContent>
        <Select
          {...rest}
          highlightItemOnHover
          id={field.name}
          value={field.state.value}
          onValueChange={(value) => field.handleChange((value as string) ?? "")}
        >
          <SelectTrigger
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? `${field.name}-error` : undefined}
            className="w-full overflow-hidden"
            onBlur={field.handleBlur}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>{children}</SelectContent>
        </Select>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

export default SelectField
