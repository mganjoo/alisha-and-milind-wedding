import React from "react"
import LabelWrapper from "./LabelWrapper"
import LabelledOption from "./LabelledOption"
import { useField } from "formik"
import classnames from "classnames"
import { useRegisteredRef } from "react-register-nodes"

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
  const ref = useRegisteredRef(name)
  const errorMessage = meta.touched ? meta.error : undefined

  return (
    <LabelWrapper label={label} group errorMessage={errorMessage}>
      <div
        className={classnames("w-full pl-1", {
          "border rounded c-invalid-outline": !!errorMessage,
        })}
      >
        {options.map((option, i) => (
          <LabelledOption
            key={`option-${option.value}`}
            name={name}
            type={type}
            label={option.label}
            value={option.value}
            ref={errorMessage && i === 0 ? ref : undefined}
          />
        ))}
      </div>
    </LabelWrapper>
  )
}
export default OptionsGroup
