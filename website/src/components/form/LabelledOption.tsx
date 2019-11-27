import React from "react"

interface LabelledOptionProps
  extends React.DetailedHTMLProps<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">,
    HTMLInputElement
  > {
  label: string
  type: "checkbox" | "radio"
  labelClassName?: string
}

const LabelledOption = React.forwardRef<HTMLInputElement, LabelledOptionProps>(
  ({ label, type, labelClassName, ...otherProps }, ref) => {
    const className =
      // Need to reference the entire class name to make PurgeCSS work
      type === "checkbox"
        ? "form-checkbox"
        : type === "radio"
        ? "form-radio"
        : undefined
    return (
      <div className="mb-2">
        <label className="inline-flex items-center">
          <input type={type} className={className} ref={ref} {...otherProps} />
          <span className="ml-2">
            <span className={labelClassName}>{label}</span>
          </span>
        </label>
      </div>
    )
  }
)
export default LabelledOption
