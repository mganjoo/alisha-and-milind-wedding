import { useRegisteredRef } from "../../utils/RegisterNodes"
import InputGroup from "./InputGroup"
import LabelledTextField from "./LabelledTextField"
import TextInput from "./TextInput"
import { useFieldError } from "./useFieldError"

interface TextInputGroupProps {
  label: string
  /** Name of the record field; each input is bound to `${groupName}.${key}`. */
  groupName: string
  fieldKeys: string[]
  fieldLabelFn: (idx: number) => string
}

const TextInputGroup = ({
  label,
  groupName,
  fieldKeys,
  fieldLabelFn,
}: TextInputGroupProps) => {
  const errorMessage = useFieldError(groupName)
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
        // biome-ignore lint/a11y/noLabelWithoutControl: the label wraps the TextInput component, which renders the <input>
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
