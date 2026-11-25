import clsx from "clsx"
import type { ComponentProps } from "react"

interface LabelledOptionProps
  extends Omit<ComponentProps<"input">, "type" | "className"> {
  type: "checkbox" | "radio"
  label: string
  bold?: boolean
}

const LabelledOption = ({
  label,
  type,
  bold,
  ...otherProps
}: LabelledOptionProps) => (
  <div>
    <label className="inline-flex items-center py-1">
      <input
        type={type}
        className={clsx(
          "c-form-element-border bg-form-background text-accent dark:text-accent-night dark:bg-form-background-night",
          "checked:bg-current checked:border-transparent dark:checked:bg-current dark:checked:border-transparent"
        )}
        {...otherProps}
      />
      <span className={clsx("ml-3", { "font-semibold": bold })}>{label}</span>
    </label>
  </div>
)

export default LabelledOption
