"use client"
import { RiMoonLine, RiSunLine } from "react-icons/ri"
import { IconButton } from "@boilerplate/ui"
import { useTheme } from "next-themes"
import * as React from "react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <IconButton
      rounded="full"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      type="submit"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      variant="ghost"
      icon={isDark ? <RiSunLine className="sq-4" /> : <RiMoonLine className="sq-4" />}
    />
  )
}
