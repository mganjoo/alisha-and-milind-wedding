import React from "react"
import { useUID } from "react-uid"

export interface LabelWrapperProps {
  label: string
  errorMessage: string | undefined
  group?: boolean
  labelType?: "text" | "id" | "aria"
}

const LabelWrapper: React.FC<LabelWrapperProps> = ({
  label,
  labelType = "text",
  errorMessage,
  group,
  children,
}) => {
  const Element = group ? "div" : "label"
  const uid = `label-${useUID()}`
  return (
    <Element
      className="block w-full mb-4 font-serif"
      role={group ? "group" : undefined}
      aria-labelledby={
        group && labelType !== "aria"
          ? labelType === "id"
            ? label
            : uid
          : undefined
      }
      aria-label={group && labelType === "aria" ? label : undefined}
    >
      {labelType === "text" && (
        <span
          className="block mb-1 text-left text-tertiary text-sm font-sans dark:text-tertiary-night"
          id={uid}
        >
          {label}
        </span>
      )}
      {children}
      {errorMessage && (
        <span
          aria-live="assertive"
          className="block my-1 text-left text-form-invalid text-sm font-medium dark:text-form-invalid-night"
        >
          {errorMessage}
        </span>
      )}
    </Element>
  )
}
export default LabelWrapper
