import { cva, type VariantProps } from "class-variance-authority"
import { type ComponentRef, forwardRef } from "react"
import { TextInput, type TextInputProps } from "react-native"

import { cn } from "@/lib/utils"

const inputVariants = cva("w-full min-w-0 rounded-md border border-input bg-transparent text-base text-foreground shadow-xs", {
  variants: {
    size: {
      default: "m-0 h-10 px-2.5",
      sm: "h-8 px-2.5 text-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export type InputProps = TextInputProps &
  VariantProps<typeof inputVariants> & {
    className?: string
  }

export const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(function Input(
  { className, size = "default", ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColorClassName="text-muted-foreground"
      className={cn(inputVariants({ size }), "disabled:opacity-50", className)}
      {...props}
    />
  )
})

export { inputVariants }
