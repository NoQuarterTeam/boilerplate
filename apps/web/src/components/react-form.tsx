import { createFormHook, createFormHookContexts } from "@tanstack/react-form"
import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@boilerplate/ui/components/button"
import { Checkbox } from "@boilerplate/ui/components/checkbox"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@boilerplate/ui/components/combobox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@boilerplate/ui/components/command"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@boilerplate/ui/components/field"
import { Input } from "@boilerplate/ui/components/input"
import { NativeSelect, type NativeSelectProps } from "@boilerplate/ui/components/native-select"
import { Popover, PopoverContent, PopoverTrigger } from "@boilerplate/ui/components/popover"
import { Select, SelectContent, SelectTrigger, SelectValue } from "@boilerplate/ui/components/select"
import { Textarea } from "@boilerplate/ui/components/textarea"
import { cn } from "@boilerplate/ui/lib/utils"

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

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
function SelectField({
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

type Primitive = string | number

type MultiSelectFieldProps<Item, StoredValue extends Primitive = Extract<Item, Primitive>> = {
  label: string
  description?: React.ReactNode
  fieldProps?: React.ComponentProps<typeof Field>
  placeholder?: string
  items: readonly Item[]
  getItemKey?: (item: Item) => string
  getItemValue?: (item: Item) => StoredValue
  itemToStringValue?: (item: Item) => string
  renderChip?: (item: Item) => React.ReactNode
  renderItem?: (item: Item) => React.ReactNode
} & Omit<
  React.ComponentProps<typeof Combobox<Item, true>>,
  "children" | "items" | "itemToStringValue" | "multiple" | "value" | "onValueChange"
>

function isPrimitive(value: unknown): value is Primitive {
  return typeof value === "string" || typeof value === "number"
}

function getDefaultItemValue<Item, StoredValue extends Primitive>(item: Item) {
  if (isPrimitive(item)) return item as unknown as StoredValue
  throw new Error("MultiSelectField requires getItemValue when items are objects")
}

function getDefaultStringValue<Item>(item: Item) {
  if (isPrimitive(item)) return String(item)
  throw new Error("MultiSelectField requires itemToStringValue when items are objects")
}

function MultiSelectField<Item, StoredValue extends Primitive>({
  label,
  description,
  fieldProps,
  placeholder,
  items,
  renderChip,
  renderItem,
  ...rest
}: MultiSelectFieldProps<Item, StoredValue>) {
  const { getItemKey, getItemValue, itemToStringValue } = rest as {
    getItemKey?: (item: Item) => string
    getItemValue?: (item: Item) => StoredValue
    itemToStringValue?: (item: Item) => string
  }
  const resolvedGetItemValue = getItemValue ?? getDefaultItemValue<Item, StoredValue>
  const resolvedItemToStringValue = itemToStringValue ?? getDefaultStringValue<Item>
  const resolvedGetItemKey = getItemKey ?? ((item: Item) => String(resolvedGetItemValue(item)))
  const resolvedRenderItem = renderItem ?? ((item: Item) => resolvedItemToStringValue(item))
  const comboboxProps = rest as Omit<
    React.ComponentProps<typeof Combobox<Item, true>>,
    "children" | "items" | "itemToStringValue" | "multiple" | "value" | "onValueChange"
  >
  const anchor = useComboboxAnchor()

  const field = useFieldContext<StoredValue[]>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const selectedItems = items.filter((item) => field.state.value.includes(resolvedGetItemValue(item)))
  return (
    <Field {...fieldProps} data-invalid={isInvalid || undefined} className={cn("gap-1", fieldProps?.className)}>
      <FieldContent className="gap-0">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <FieldContent>
        <Combobox
          autoHighlight
          {...comboboxProps}
          items={items}
          itemToStringValue={resolvedItemToStringValue}
          multiple
          value={selectedItems}
          onValueChange={(value) => field.handleChange(value.map((item) => resolvedGetItemValue(item)))}
        >
          <ComboboxChips ref={anchor} className="w-full">
            <ComboboxValue>
              {(values: Item[] | undefined) => (
                <>
                  {values?.map((item: Item) => (
                    <ComboboxChip key={resolvedGetItemKey(item)}>{renderChip?.(item) ?? resolvedRenderItem(item)}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    aria-invalid={isInvalid}
                    aria-describedby={isInvalid ? `${field.name}-error` : undefined}
                    placeholder={values?.length ? "" : placeholder}
                  />
                  <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            <ComboboxList>
              {(item) => (
                <ComboboxItem key={resolvedGetItemKey(item)} value={item}>
                  {resolvedRenderItem(item)}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  )
}

type AsyncSelectFieldProps<Item, StoredValue extends Primitive = Extract<Item, Primitive>> = {
  label: string
  description?: React.ReactNode
  fieldProps?: React.ComponentProps<typeof Field>
  placeholder?: string
  items: readonly Item[]
  search: string
  onSearchChange: (search: string) => void
  isPending?: boolean
  selectedItem?: Item | null
  getItemKey?: (item: Item) => number | string
  getItemValue?: (item: Item) => StoredValue
  itemToStringValue?: (item: Item) => string
  renderItem?: (item: Item) => React.ReactNode
  onItemSelect?: (item: Item) => void
  disabled?: boolean
}

function AsyncSelectField<Item, StoredValue extends Primitive>({
  label,
  description,
  fieldProps,
  placeholder = "Select an option",
  items,
  search,
  onSearchChange,
  isPending = false,
  selectedItem,
  renderItem,
  onItemSelect,
  disabled = false,
  ...rest
}: AsyncSelectFieldProps<Item, StoredValue>) {
  const { getItemKey, getItemValue, itemToStringValue } = rest
  const resolvedGetItemValue = getItemValue ?? getDefaultItemValue<Item, StoredValue>
  const resolvedItemToStringValue = itemToStringValue ?? getDefaultStringValue<Item>
  const resolvedGetItemKey = getItemKey ?? ((item: Item) => String(resolvedGetItemValue(item)))
  const resolvedRenderItem = renderItem ?? ((item: Item) => resolvedItemToStringValue(item))

  const [open, setOpen] = React.useState(false)
  const field = useFieldContext<StoredValue | undefined>()
  const isInvalid = field.state.meta.isTouched && field.state.meta.errors.length > 0
  const resolvedSelectedItem = selectedItem ?? items.find((item) => resolvedGetItemValue(item) === field.state.value) ?? null

  return (
    <Field {...fieldProps} data-invalid={isInvalid || undefined} className={cn("gap-1", fieldProps?.className)}>
      <FieldContent className="gap-0">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <FieldContent>
        <Popover
          open={open}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen)
            if (!nextOpen) field.handleBlur()
          }}
        >
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-full justify-between border-input bg-transparent px-2.5 font-normal shadow-xs dark:bg-input/30 dark:hover:bg-input/50"
              />
            }
            id={field.name}
            aria-invalid={isInvalid}
            aria-describedby={isInvalid ? `${field.name}-error` : undefined}
            aria-expanded={open}
            disabled={disabled}
          >
            <span className={cn("truncate", !resolvedSelectedItem && "text-muted-foreground")}>
              {resolvedSelectedItem ? resolvedItemToStringValue(resolvedSelectedItem) : placeholder}
            </span>
            <ChevronDownIcon className="text-muted-foreground" />
          </PopoverTrigger>
          <PopoverContent className="w-(--anchor-width) min-w-72 p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput autoFocus placeholder="Search..." value={search} onValueChange={onSearchChange} />
              <CommandList>
                <CommandEmpty>{isPending ? "Loading..." : search ? "No results found." : "Type to search..."}</CommandEmpty>
                {items.length > 0 && (
                  <CommandGroup>
                    {items.map((item) => {
                      const itemValue = resolvedGetItemValue(item)
                      const isSelected = itemValue === field.state.value
                      return (
                        <CommandItem
                          key={resolvedGetItemKey(item)}
                          value={String(itemValue)}
                          data-checked={isSelected || undefined}
                          data-selected={isSelected || undefined}
                          onSelect={() => {
                            field.handleChange(itemValue)
                            onItemSelect?.(item)
                            setOpen(false)
                          }}
                        >
                          {resolvedRenderItem(item)}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
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
  formComponents: {},
})
