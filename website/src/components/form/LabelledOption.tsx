import classnames from "classnames"
import React from "react"

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

const LabelledOption = React.forwardRef<HTMLInputElement, LabelledOptionProps>(
  ({ label, type, bold, ...otherProps }, ref) => (
    <div>
      <label className="inline-flex items-center py-1">
        <input
          type={type}
          className="c-form-element-border bg-form-background text-accent dark:text-accent-night dark:bg-form-background-night"
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
