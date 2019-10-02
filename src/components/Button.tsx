import React from "react"
import classnames from "classnames"

const Button: React.FunctionComponent<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children, className, ...otherProps }) => (
  <button className={classnames("c-button", className)} {...otherProps}>
    {children}
  </button>
)
export default Button
