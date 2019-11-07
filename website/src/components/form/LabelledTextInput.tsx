import React, { useContext } from "react"
import LabelWrapper from "./LabelWrapper"
import { useField } from "formik"
import TextInput from "./TextInput"
import { BaseFormHelpersContext } from "./BaseForm"

interface LabelledTextInputProps {
  label: string
  name: string
  type: "text" | "email"
  autoComplete?: string
}

const LabelledTextInput: React.FC<LabelledTextInputProps> = ({
  label,
  name,
  ...props
}) => {
  const [field, meta] = useField<string>(name)
  const baseFormHelpers = useContext(BaseFormHelpersContext)

  return (
    <LabelWrapper
      label={label}
      errorMessage={meta.touched ? meta.error : undefined}
    >
      <TextInput
        {...field}
        {...props}
        ref={baseFormHelpers.registerRef}
        invalid={meta.touched && meta.error !== undefined}
      />
    </LabelWrapper>
  )
}
export default LabelledTextInput
