import React from "react"

interface LabelWrapperProps {
  label: string
  error?: boolean
  errorMessage?: string
}

const LabelWrapper: React.FunctionComponent<LabelWrapperProps> = ({
  label,
  errorMessage,
  error,
  children,
}) => {
  return (
    <label className="flex flex-wrap justify-between mt-3 text-sm w-full sm:text-base">
      <span className="text-gray-700 whitespace-no-wrap lg:order-first">
        {label}
      </span>
      {children}
      {errorMessage && (
        <span
          aria-live="assertive"
          className="mt-1 flex justify-end whitespace-no-wrap text-red-700 font-medium lg:mt-0 lg:order-first"
        >
          {error && errorMessage}
        </span>
      )}
    </label>
  )
}
export default LabelWrapper
