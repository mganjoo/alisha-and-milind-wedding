import { useField } from "formik"
import React from "react"
import LabelledOption from "./LabelledOption"

interface ControlledLabelledOptionProps {
  name: string
  type: "radio" | "checkbox"
  label: string
  value: string
}

const ControlledLabelledOption = React.forwardRef<
  HTMLInputElement,
  ControlledLabelledOptionProps
>(({ label, name, type, value }, ref) => {
  const [field] = useField<any>({ name, type, value })
  return <LabelledOption {...field} label={label} type={type} ref={ref} />
})

export default ControlledLabelledOption
