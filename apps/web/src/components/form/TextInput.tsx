import clsx from "clsx"
import type { ComponentProps } from "react"
import { useFormContext } from "react-hook-form"
import { useMergedRef } from "./mergeRefs"
import styles from "./TextInput.module.css"

interface TextInputProps
  extends Omit<ComponentProps<"input">, "type" | "name" | "className"> {
  name: string
  type: "text" | "email"
  invalid?: boolean
}

const TextInput = ({
  type,
  invalid,
  name,
  ref,
  ...otherProps
}: TextInputProps) => {
  const { register } = useFormContext()
  const { ref: fieldRef, ...field } = register(name)
  const mergedRef = useMergedRef(fieldRef, ref, name)
  return (
    <input
      {...field}
      ref={mergedRef}
      type={type}
      className={clsx(styles.input, "c-form-element-border", {
        [styles.invalid]: invalid,
      })}
      {...otherProps}
    />
  )
}
export default TextInput
