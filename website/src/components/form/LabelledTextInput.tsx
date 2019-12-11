import React from "react"
import LabelWrapper from "./LabelWrapper"
import { useField } from "formik"
import TextInput from "./TextInput"
import { useRegisteredRef } from "react-register-nodes"

interface LabelledTextInputProps {
  label: string
  name: string
  type: "text" | "email"
  autoComplete?: string
  autoCapitalize?: string
  autoCorrect?: string
}

const LabelledTextInput: React.FC<LabelledTextInputProps> = ({
  label,
  name,
  ...props
}) => {
  const [, meta] = useField<string>(name)
  const errorMessage = meta.touched ? meta.error : undefined
  const ref = useRegisteredRef(name)

  return (
    <LabelWrapper label={label} errorMessage={errorMessage}>
      <TextInput
        name={name}
        invalid={!!errorMessage}
        ref={errorMessage ? ref : undefined}
        {...props}
      />
    </LabelWrapper>
  )
}
export default LabelledTextInput
