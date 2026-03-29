import { ChevronDownIcon } from "lucide-react"

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
} from "@boilerplate/ui/components/combobox"
import { useComboboxAnchor } from "@boilerplate/ui/components/combobox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@boilerplate/ui/components/field"
import { cn } from "@boilerplate/ui/lib/utils"

import { useFieldContext } from "./context"

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

export default MultiSelectField
