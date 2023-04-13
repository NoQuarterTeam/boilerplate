import * as React from "react"
import { TouchableOpacityProps, TouchableOpacity, useColorScheme } from "react-native"
import { merge } from "@boilerplate/shared"
import { cva, VariantProps } from "class-variance-authority"
import { Text } from "./Text"
import { Spinner } from "./Spinner"

export const buttonStyles = cva("flex items-center justify-center rounded-sm border", {
  variants: {
    size: {
      xs: "h-8",
      sm: "h-10",
      md: "h-12",
      lg: "h-14",
    },
    variant: {
      primary: "bg-primary-600 border-primary-600",
      outline: "border-gray-100 bg-transparent dark:border-gray-600",
      ghost: "bg-transparent border-transparent",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
})
export const buttonTextStyles = cva("font-heading text-center text-lg", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
    },
    variant: {
      primary: "text-white",
      outline: "text-gray-900 dark:text-white",
      ghost: "text-gray-900 dark:text-white",
    },
  },
})
export type ButtonStyleProps = VariantProps<typeof buttonStyles>

interface Props extends TouchableOpacityProps, ButtonStyleProps {
  className?: string
  textClassName?: string
  children: React.ReactNode
  isLoading?: boolean
}

export function Button({ variant = "primary", size = "md", isLoading, ...props }: Props) {
  const colorScheme = useColorScheme()
  return (
    <TouchableOpacity
      {...props}
      disabled={props.disabled || isLoading}
      activeOpacity={0.7}
      className={merge(
        buttonStyles({ variant, size, className: props.className }),
        (props.disabled || isLoading) && "opacity-70",
      )}
    >
      {isLoading ? (
        <Spinner
          size={size === "md" ? 20 : size === "lg" ? 25 : 15}
          color={variant === "primary" ? "white" : colorScheme === "dark" ? "white" : "black"}
        />
      ) : (
        <Text className={buttonTextStyles({ variant, className: props.textClassName })}>{props.children}</Text>
      )}
    </TouchableOpacity>
  )
}
