import classnames from "classnames"
import React from "react"
import { assertNever } from "../../utils/Utils"

type OptionType = "checkbox" | "radio"

interface LabelledOptionProps
  extends React.DetailedHTMLProps<
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "className">,
    HTMLInputElement
  > {
  type: OptionType
  label: string
  bold?: boolean
}

function getInputClass(type: OptionType) {
  // Need to reference the entire class name to make PurgeCSS work
  switch (type) {
    case "checkbox":
      return "form-checkbox"
    case "radio":
      return "form-radio"
    default:
      return assertNever(type)
  }
}

const LabelledOption = React.forwardRef<HTMLInputElement, LabelledOptionProps>(
  ({ label, type, bold, ...otherProps }, ref) => (
    <div className="my-2">
      <label className="inline-flex items-center">
        <input
          type={type}
          className={getInputClass(type)}
          ref={ref}
          {...otherProps}
        />
        <span className={classnames("ml-2", { "font-semibold": bold })}>
          {label}
        </span>
      </label>
    </div>
  )
)

export default LabelledOption
