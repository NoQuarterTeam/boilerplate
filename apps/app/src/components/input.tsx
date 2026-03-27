import { cva, type VariantProps } from "class-variance-authority"
import { type ComponentRef, forwardRef } from "react"
import { TextInput, type TextInputProps } from "react-native"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "m-0 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-0 text-foreground shadow-xs",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-8 text-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

export type InputProps = TextInputProps & VariantProps<typeof inputVariants> & { className?: string }

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
