import React from "react"
import LabelWrapper, { LabelWrapperProps } from "./LabelWrapper"
import classnames from "classnames"

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
          errorMessage ? "border-invalid" : "border-transparent"
        )}
      >
        {children}
      </div>
    </LabelWrapper>
  )
}
export default InputGroup
