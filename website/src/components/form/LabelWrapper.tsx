import React from "react"

interface LabelWrapperProps {
  label: string
  errorMessage: string | null
}

const LabelWrapper: React.FC<LabelWrapperProps> = ({
  label,
  errorMessage,
  children,
}) => {
  return (
    <label className="flex flex-wrap justify-between mt-3 text-sm font-serif w-full">
      <span className="text-gray-700 whitespace-no-wrap lg:order-first">
        {label}
      </span>
      {children}
      {errorMessage && (
        <span
          aria-live="assertive"
          className="mt-1 flex justify-end whitespace-no-wrap text-red-700 font-medium lg:mt-0 lg:order-first"
        >
          {errorMessage}
        </span>
      )}
    </label>
  )
}
export default LabelWrapper
