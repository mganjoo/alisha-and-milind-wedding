import React from "react"
import { useUID } from "react-uid"

interface LabelWrapperProps {
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
      className="flex flex-wrap justify-between mb-4 font-serif w-full"
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
          className="mb-1 text-gray-700 whitespace-no-wrap text-sm font-sans"
          id={uid}
        >
          {label}
        </span>
      )}
      {children}
      {errorMessage && (
        <span
          aria-live="assertive"
          className="mt-1 mb-1 flex justify-end whitespace-no-wrap text-sm text-red-700 font-medium"
        >
          {errorMessage}
        </span>
      )}
    </Element>
  )
}
export default LabelWrapper
