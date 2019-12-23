import React from "react"
import TextInput from "./TextInput"
import { useFormikContext } from "formik"
import { useRegisteredRef } from "react-register-nodes"
import LabelledTextField from "./LabelledTextField"
import InputGroup from "./InputGroup"

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
        <label key={fieldKey} className="my-3 flex items-center">
          <span className="flex mr-2 w-6 h-6 items-center justify-center font-sans text-xs bg-gray-200 border border-gray-subtle text-gray-900 rounded-full">
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
