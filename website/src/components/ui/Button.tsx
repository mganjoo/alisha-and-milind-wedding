import React from "react"
import classnames from "classnames"

export interface ButtonProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "type"
  > {
  isSecondary?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  isSecondary,
  className,
  ...otherProps
}) => (
  <button
    className={classnames(
      "c-button",
      isSecondary ? "c-button-secondary" : "c-button-primary",
      className
    )}
    type={isSecondary ? "button" : "submit"}
    {...otherProps}
  >
    {children}
  </button>
)
export default Button
