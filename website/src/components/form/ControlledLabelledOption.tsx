import React from "react"
import { useField } from "formik"
import LabelledOption from "./LabelledOption"

interface ControlledLabelledOptionProps {
  name: string
  type: "radio" | "checkbox"
  label: string
  value: string
  labelClassName?: string
}

const ControlledLabelledOption = React.forwardRef<
  HTMLInputElement,
  ControlledLabelledOptionProps
>(({ label, name, type, value, labelClassName }, ref) => {
  const [field] = useField<any>({ name, type, value })
  return (
    <LabelledOption
      {...field}
      label={label}
      type={type}
      ref={ref}
      labelClassName={labelClassName}
    />
  )
})
export default ControlledLabelledOption
