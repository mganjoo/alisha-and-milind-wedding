import React, { useContext } from "react"
import LabelWrapper from "./LabelWrapper"
import LabelledOption from "./LabelledOption"
import { useField } from "formik"
import { BaseFormHelpersContext } from "./BaseForm"

interface Option {
  value: string
  label: string
}

interface OptionsGroupProps {
  name: string
  label: string
  type: "radio" | "checkbox"
  options: Option[]
}

const OptionsGroup: React.FC<OptionsGroupProps> = ({
  name,
  type,
  options,
  label,
}) => {
  const [, meta] = useField(name)
  const baseFormHelpers = useContext(BaseFormHelpersContext)

  return (
    <LabelWrapper
      label={label}
      group
      errorMessage={meta.touched ? meta.error : undefined}
    >
      <div className="w-full">
        {options.map((option, i) => (
          <LabelledOption
            key={`option-${option.value}`}
            name={name}
            type={type}
            label={option.label}
            value={option.value}
            ref={i === 0 ? baseFormHelpers.registerRef : null}
          />
        ))}
      </div>
    </LabelWrapper>
  )
}
export default OptionsGroup
