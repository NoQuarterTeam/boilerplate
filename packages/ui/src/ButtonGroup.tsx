import { merge } from "@boilerplate/shared"

export function ButtonGroup(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={merge("flex items-center justify-end space-x-2", props.className)}>
      {props.children}
    </div>
  )
}
