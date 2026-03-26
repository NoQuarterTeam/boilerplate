import { cva, type VariantProps } from "class-variance-authority"
import { createContext, type ComponentRef, forwardRef, useContext } from "react"
import { Pressable, Text, type PressableProps, type TextProps } from "react-native"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "shrink-0 flex-row items-center justify-center gap-1.5 rounded-md border border-transparent bg-clip-padding font-medium active:translate-y-px disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/80",
        outline:
          "border-border bg-background shadow-xs active:bg-muted dark:border-input dark:bg-input/30 dark:active:bg-input/50",
        secondary: "bg-secondary active:bg-secondary/80",
        ghost: "active:bg-muted dark:active:bg-muted/50",
        destructive: "bg-destructive/10 active:bg-destructive/20 dark:bg-destructive/20 dark:active:bg-destructive/30",
        link: "border-transparent",
        brand: "bg-brand-primary shadow-[inset_0_-3px_0_0_rgb(0_0_0/0.2)] active:bg-brand-primary/80",
        "brand-secondary": "bg-brand-secondary shadow-[inset_0_-3px_0_0_rgb(0_0_0/0.2)] active:bg-brand-secondary/80",
      },
      size: {
        default: "h-9 px-2.5",
        xs: "h-6 gap-1 rounded-md px-2",
        sm: "h-8 gap-1 rounded-md px-2.5",
        lg: "h-10 px-2.5",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const buttonTextVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      outline: "text-foreground",
      secondary: "text-secondary-foreground",
      ghost: "text-foreground",
      destructive: "text-destructive",
      link: "text-primary underline",
      brand: "font-bold text-white",
      "brand-secondary": "font-bold text-white",
    },
    size: {
      default: "",
      xs: "text-xs",
      sm: "text-xs",
      lg: "",
      icon: "",
      "icon-xs": "",
      "icon-sm": "",
      "icon-lg": "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ButtonVariantProps = VariantProps<typeof buttonVariants>

const ButtonVariantContext = createContext<ButtonVariantProps>({
  variant: "default",
  size: "default",
})

export type ButtonProps = PressableProps &
  ButtonVariantProps & {
    className?: string
  }

export const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(function Button(
  { className, variant = "default", size = "default", disabled, ...props },
  ref,
) {
  return (
    <ButtonVariantContext.Provider value={{ variant, size }}>
      <Pressable ref={ref} disabled={disabled} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    </ButtonVariantContext.Provider>
  )
})

export type ButtonTextProps = TextProps & { className?: string }

export function ButtonText({ className, ...props }: ButtonTextProps) {
  const { variant, size } = useContext(ButtonVariantContext)
  return <Text className={cn(buttonTextVariants({ variant, size }), className)} {...props} />
}

export { buttonTextVariants, buttonVariants }
