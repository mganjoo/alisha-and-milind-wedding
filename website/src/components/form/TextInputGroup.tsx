import { useFormikContext } from "formik"
import React from "react"
import { useRegisteredRef } from "../../utils/RegisterNodes"
import InputGroup from "./InputGroup"
import LabelledTextField from "./LabelledTextField"
import TextInput from "./TextInput"

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
  const makeFieldKey = (fieldKey: string) => `${groupName}.${fieldKey}`

  return fieldKeys.length === 0 ? null : fieldKeys.length === 1 ? (
    <LabelledTextField
      label={label}
      name={makeFieldKey(fieldKeys[0])}
      type="text"
    />
  ) : (
    <InputGroup label={label} errorMessage={errorMessage}>
      {fieldKeys.map((fieldKey, i) => (
        <label key={fieldKey} className="flex items-center my-3">
          <span className="flex items-center justify-center w-6 h-6 mr-2 font-sans text-xs border rounded-full bg-secondary-night border-subtle text-primary dark:border-transparent">
            {i + 1}
          </span>
          <TextInput
            type="text"
            name={makeFieldKey(fieldKey)}
            placeholder={fieldLabelFn(i + 1)}
            aria-label={fieldLabelFn(i + 1)}
            ref={errorMessage && i === 0 ? ref : undefined}
          />
        </label>
      ))}
    </InputGroup>
  )
}
export default TextInputGroup
