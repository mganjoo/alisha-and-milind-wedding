import React from "react"
import TextInput from "./TextInput"
import LabelWrapper from "./LabelWrapper"
import { useFormikContext } from "formik"
import { useRegisteredRef } from "react-register-nodes"

interface TextInputGroupProps {
  label: string
  errorKey: string
  fieldNames: string[]
  fieldLabelFn: (idx: number) => string
}

const TextInputGroup: React.FC<TextInputGroupProps> = ({
  label,
  errorKey,
  fieldNames,
  fieldLabelFn,
}) => {
  const { getFieldMeta } = useFormikContext()
  const meta = getFieldMeta(errorKey)
  const errorMessage = meta.touched ? meta.error : undefined
  const ref = useRegisteredRef(errorKey)

  return (
    <LabelWrapper
      label={label}
      errorMessage={meta.touched ? meta.error : undefined}
      group
    >
      <div className="w-full">
        {fieldNames.map((fieldName, i) => (
          <TextInput
            key={fieldName}
            type="text"
            name={fieldName}
            className="mt-1 mb-2"
            invalid={!!errorMessage && i === 0}
            placeholder={fieldLabelFn(i + 1)}
            aria-label={fieldLabelFn(i + 1)}
            ref={errorMessage && i === 0 ? ref : undefined}
          />
        ))}
      </div>
    </LabelWrapper>
  )
}
export default TextInputGroup
