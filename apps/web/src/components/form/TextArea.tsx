import clsx from "clsx"
import type { ComponentProps } from "react"
import { useFormContext } from "react-hook-form"
import { useMergedRef } from "./mergeRefs"
import styles from "./TextInput.module.css"

interface TextAreaProps
  extends Omit<ComponentProps<"textarea">, "name" | "className"> {
  name: string
  invalid?: boolean
}

const TextArea = ({ invalid, name, ref, ...otherProps }: TextAreaProps) => {
  const { register } = useFormContext()
  const { ref: fieldRef, ...field } = register(name)
  const mergedRef = useMergedRef(fieldRef, ref, name)
  return (
    <textarea
      {...field}
      ref={mergedRef}
      className={clsx("resize-none c-form-element-border", styles.input, {
        [styles.invalid]: invalid,
      })}
      {...otherProps}
    />
  )
}
export default TextArea
