import { Text as RText, type TextProps } from "react-native"

import { merge } from "@boilerplate/shared"

export function Text(props: TextProps) {
  return (
    <RText {...props} className={merge("font-body dark:text-white", props.className)}>
      {props.children}
    </RText>
  )
}
