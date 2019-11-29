import React from "react"
import TextInput from "./TextInput"
import LabelWrapper from "./LabelWrapper"
import { useFormikContext } from "formik"
import { useRegisteredRef } from "react-register-nodes"
import classnames from "classnames"
import LabelledTextInput from "./LabelledTextInput"

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
    <LabelledTextInput
      label={label}
      name={makeFieldKey(fieldKeys[0])}
      type="text"
    />
  ) : (
    <LabelWrapper
      label={label}
      errorMessage={meta.touched ? meta.error : undefined}
      group={fieldKeys.length > 1}
    >
      <div
        className={classnames("w-full pl-2 pr-3 pt-2 rounded", {
          "border c-invalid-outline": !!meta.error,
        })}
      >
        {fieldKeys.map((fieldKey, i) => (
          <label key={fieldKey} className="mt-1 mb-2 flex items-center">
            <span className="mr-2 w-6 h-6 flex items-center justify-center font-sans text-xs bg-gray-200 border c-subtle-border text-gray-900 rounded-full">
              {i + 1}
            </span>
            <TextInput
              type="text"
              name={makeFieldKey(fieldKey)}
              className="w-full mb-1"
              placeholder={
                fieldKeys.length > 1 ? fieldLabelFn(i + 1) : undefined
              }
              aria-label={
                fieldKeys.length > 1 ? fieldLabelFn(i + 1) : undefined
              }
              ref={errorMessage && i === 0 ? ref : undefined}
            />
          </label>
        ))}
      </div>
    </LabelWrapper>
  )
}
export default TextInputGroup
