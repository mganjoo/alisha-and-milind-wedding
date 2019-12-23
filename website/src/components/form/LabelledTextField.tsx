import { useField } from "formik"
import React from "react"
import { useRegisteredRef } from "react-register-nodes"
import LabelWrapper from "./LabelWrapper"
import TextArea from "./TextArea"
import TextInput from "./TextInput"

interface CommonProps {
  label: string
  name: string
}

interface LabelledTextInputProps extends CommonProps {
  type: "text" | "email"
  autoComplete?: string
  autoCapitalize?: string
  autoCorrect?: string
}

interface LabelledTextAreaProps extends CommonProps {
  type: "textarea"
  rows?: number
  placeholder?: string
}

type LabelledTextFieldProps = LabelledTextInputProps | LabelledTextAreaProps

function getField(
  props: LabelledTextFieldProps,
  invalid: boolean,
  ref: (node: any) => void
) {
  switch (props.type) {
    case "text":
    case "email":
      return (
        <TextInput
          name={props.name}
          invalid={invalid}
          ref={invalid ? ref : undefined}
          {...props}
        />
      )
    case "textarea":
      return (
        <TextArea
          name={props.name}
          invalid={invalid}
          ref={invalid ? ref : undefined}
          {...props}
        />
      )
  }
}

const LabelledTextField: React.FC<LabelledTextFieldProps> = props => {
  const { label, name } = props
  const [, meta] = useField<string>(name)
  const errorMessage = meta.touched ? meta.error : undefined
  const ref = useRegisteredRef(name)

  return (
    <LabelWrapper label={label} errorMessage={errorMessage}>
      {getField(props, !!errorMessage, ref)}
    </LabelWrapper>
  )
}
export default LabelledTextField
