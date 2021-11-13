import classnames from "classnames"
import React from "react"
import LabelWrapper, { LabelWrapperProps } from "./LabelWrapper"

type InputGroupProps = Omit<LabelWrapperProps, "group">

const InputGroup: React.FC<InputGroupProps> = ({
  children,
  errorMessage,
  ...otherProps
}) => {
  return (
    <LabelWrapper errorMessage={errorMessage} group {...otherProps}>
      <div
        className={classnames(
          "w-full px-3 border rounded",
          errorMessage ? "border-form-invalid-night" : "border-transparent"
        )}
      >
        {children}
      </div>
    </LabelWrapper>
  )
}
export default InputGroup
