"use client"
import { X } from "lucide-react"
import * as React from "react"

import { IconButton, type IconButtonProps } from "./IconButton"

export const CloseButton = React.forwardRef<HTMLButtonElement, Omit<IconButtonProps, "ref" | "icon" | "aria-label">>(
  function _CloseButton(props, ref) {
    return <IconButton ref={ref} variant="ghost" icon={<X />} aria-label="close" size="xs" {...props} />
  },
)
