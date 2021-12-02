import { useField } from "formik"
import React from "react"
import { useRegisteredRef } from "../../utils/RegisterNodes"
import InputGroup from "./InputGroup"
import LabelledOption from "./LabelledOption"

interface SingleCheckboxProps {
  name: string
  groupLabel: string
  groupLabelType?: "text" | "id" | "aria"
  optionLabel: string
  disabled?: boolean
}

const SingleCheckbox: React.FC<SingleCheckboxProps> = ({
  optionLabel,
  name,
  groupLabel,
  disabled,
  groupLabelType = "text",
}) => {
  const [field, meta] = useField<any>({ name, type: "checkbox" })
  const ref = useRegisteredRef(name)
  const errorMessage = meta.touched ? meta.error : undefined
  return (
    <InputGroup
      label={groupLabel}
      labelType={groupLabelType}
      errorMessage={errorMessage}
    >
      <LabelledOption
        {...field}
        label={optionLabel}
        type="checkbox"
        disabled={disabled}
        ref={ref}
      />
    </InputGroup>
  )
}
export default SingleCheckbox
