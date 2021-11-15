import { useField } from "formik"
import React from "react"
import { useRegisteredRef } from "../../utils/RegisterNodes"
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
  placeholder?: string
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
          invalid={invalid}
          ref={invalid ? ref : undefined}
          {...props}
        />
      )
    case "textarea":
      return (
        <TextArea
          invalid={invalid}
          ref={invalid ? ref : undefined}
          {...props}
        />
      )
  }
}

const LabelledTextField: React.FC<LabelledTextFieldProps> = (props) => {
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
