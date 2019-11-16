import React from "react"
import TextInput from "./TextInput"
import LabelWrapper from "./LabelWrapper"
import { useFormikContext } from "formik"
import { useRegisteredRef } from "react-register-nodes"

interface TextInputGroupProps {
  label: string
  groupName: string
  fieldKeys: string[]
  fieldLabelFn: (idx: number) => string
}

const TextInputGroup: React.FC<TextInputGroupProps> = ({
  label,
  groupName,
  fieldKeys,
  fieldLabelFn,
}) => {
  const { getFieldMeta } = useFormikContext()
  const meta = getFieldMeta(groupName)
  const errorMessage = meta.touched ? meta.error : undefined
  const ref = useRegisteredRef(groupName)

  return (
    <LabelWrapper
      label={label}
      errorMessage={meta.touched ? meta.error : undefined}
      group={fieldKeys.length > 1}
    >
      <div className="w-full">
        {fieldKeys.map((fieldKey, i) => (
          <TextInput
            key={fieldKey}
            type="text"
            name={`guests.${fieldKey}`}
            className="mt-1 mb-2"
            invalid={!!errorMessage && i === 0}
            placeholder={fieldKeys.length > 1 ? fieldLabelFn(i + 1) : undefined}
            aria-label={fieldKeys.length > 1 ? fieldLabelFn(i + 1) : undefined}
            ref={errorMessage && i === 0 ? ref : undefined}
          />
        ))}
      </div>
    </LabelWrapper>
  )
}
export default TextInputGroup
