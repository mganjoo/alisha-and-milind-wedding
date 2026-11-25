import clsx from "clsx"
import type { PropsWithChildren } from "react"
import LabelWrapper, { type LabelWrapperProps } from "./LabelWrapper"

type InputGroupProps = Omit<LabelWrapperProps, "group">

const InputGroup = ({
  children,
  errorMessage,
  ...otherProps
}: PropsWithChildren<InputGroupProps>) => {
  return (
    <LabelWrapper errorMessage={errorMessage} group {...otherProps}>
      <div
        className={clsx(
          "w-full px-3 border rounded-sm",
          errorMessage ? "border-form-invalid-night" : "border-transparent"
        )}
      >
        {children}
      </div>
    </LabelWrapper>
  )
}
export default InputGroup
