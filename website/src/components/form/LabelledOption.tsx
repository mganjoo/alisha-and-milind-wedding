import React from "react"
import { useField } from "formik"

interface LabelledOptionProps
  extends React.DetailedHTMLProps<
    Omit<Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">, "name">,
    HTMLInputElement
  > {
  name: string
  label: string
  type: "checkbox" | "radio"
}

const LabelledOption = React.forwardRef<HTMLInputElement, LabelledOptionProps>(
  ({ label, name, type, value, ...otherProps }, ref) => {
    const [field] = useField<any>({ name, type, value })
    const className =
      // Need to reference the entire class name to make PurgeCSS work
      type === "checkbox"
        ? "form-checkbox"
        : type === "radio"
        ? "form-radio"
        : undefined
    return (
      <div className="mt-1">
        <label className="inline-flex items-center">
          <input
            {...field}
            type={type}
            className={className}
            ref={ref}
            {...otherProps}
          />
          <span className="ml-2">{label}</span>
        </label>
      </div>
    )
  }
)
export default LabelledOption
