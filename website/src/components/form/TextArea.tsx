import React from "react"
import { useField } from "formik"
import "./TextInput.module.css"
import classnames from "classnames"

interface TextAreaProps
  extends React.DetailedHTMLProps<
    Omit<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      "name" | "className"
    >,
    HTMLTextAreaElement
  > {
  name: string
  invalid?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ invalid, name, ...otherProps }, ref) => {
    const [field] = useField<string>(name)
    return (
      <textarea
        {...field}
        ref={ref}
        className="block w-full form-textarea resize-none"
        styleName={classnames({ invalid: invalid })}
        {...otherProps}
      />
    )
  }
)
export default TextArea
