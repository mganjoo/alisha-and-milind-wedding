import { useRegisteredRef } from "../../utils/RegisterNodes"
import LabelWrapper from "./LabelWrapper"
import TextArea from "./TextArea"
import TextInput from "./TextInput"
import { useFieldError } from "./useFieldError"

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

const LabelledTextField = (props: LabelledTextFieldProps) => {
  const { label, name } = props
  const errorMessage = useFieldError(name)
  const registeredRef = useRegisteredRef(name)
  const invalid = !!errorMessage
  const ref = invalid ? registeredRef : undefined

  return (
    <LabelWrapper label={label} errorMessage={errorMessage}>
      {props.type === "textarea" ? (
        <TextArea
          invalid={invalid}
          ref={ref}
          name={name}
          rows={props.rows}
          placeholder={props.placeholder}
        />
      ) : (
        <TextInput
          invalid={invalid}
          ref={ref}
          name={name}
          type={props.type}
          autoComplete={props.autoComplete}
          autoCapitalize={props.autoCapitalize}
          autoCorrect={props.autoCorrect}
          placeholder={props.placeholder}
        />
      )}
    </LabelWrapper>
  )
}
export default LabelledTextField
