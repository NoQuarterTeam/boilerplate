import { ComponentProps } from "react"
import { Text as RnText } from "react-native"

import { cn } from "@/lib/utils"

export function Text({ children, className }: ComponentProps<typeof RnText>) {
  return <RnText className={cn("text-base text-foreground", className)}>{children}</RnText>
}
