import { TextProps, Text as RText } from "react-native"
import { merge } from "@boilerplate/shared"

export function Heading(props: TextProps) {
  return (
    <RText {...props} className={merge("font-heading dark:text-white", props.className)}>
      {props.children}
    </RText>
  )
}
