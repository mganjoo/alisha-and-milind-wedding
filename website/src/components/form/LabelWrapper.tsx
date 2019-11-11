import React from "react"
import { useUID } from "react-uid"

interface LabelWrapperProps {
  label: string
  errorMessage: string | undefined
  group?: boolean
}

const LabelWrapper: React.FC<LabelWrapperProps> = ({
  label,
  errorMessage,
  group,
  children,
}) => {
  const Element = group ? "div" : "label"
  const uid = `label-${useUID()}`
  return (
    <Element
      className="flex flex-wrap justify-between mt-3 mb-2 font-serif w-full"
      role={group ? "group" : undefined}
      aria-labelledby={group ? uid : undefined}
    >
      <span
        className="mb-1 text-gray-700 whitespace-no-wrap text-sm lg:order-first"
        id={uid}
      >
        {label}
      </span>
      {children}
      {errorMessage && (
        <span
          aria-live="assertive"
          className="mt-1 flex justify-end whitespace-no-wrap text-sm text-red-700 font-medium lg:mt-0 lg:order-first"
        >
          {errorMessage}
        </span>
      )}
    </Element>
  )
}
export default LabelWrapper
