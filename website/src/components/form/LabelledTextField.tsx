import React from "react"
import LabelWrapper from "./LabelWrapper"
import { useField } from "formik"
import TextInput from "./TextInput"
import { useRegisteredRef } from "react-register-nodes"
import TextArea from "./TextArea"

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
