import { ChevronDownIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@boilerplate/ui/components/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@boilerplate/ui/components/command"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@boilerplate/ui/components/field"
import { Popover, PopoverContent, PopoverTrigger } from "@boilerplate/ui/components/popover"
import { cn } from "@boilerplate/ui/lib/utils"

import { useFieldContext } from "./context"

type Primitive = string | number

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

export function AsyncSelectField<Item, StoredValue extends Primitive>({
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

export default AsyncSelectField

function isPrimitive(value: unknown): value is Primitive {
  return typeof value === "string" || typeof value === "number"
}

function getDefaultItemValue<Item, StoredValue extends Primitive>(item: Item) {
  if (isPrimitive(item)) return item as unknown as StoredValue
  throw new Error("AsyncSelectField requires getItemValue when items are objects")
}

function getDefaultStringValue<Item>(item: Item) {
  if (isPrimitive(item)) return String(item)
  throw new Error("AsyncSelectField requires itemToStringValue when items are objects")
}
