import classnames from "classnames"
import React from "react"

type ButtonPurpose = "submit" | "primary" | "secondary"

function getPurposeClass(purpose: ButtonPurpose) {
  switch (purpose) {
    case "submit":
    case "primary":
      return "c-button-primary"
    case "secondary":
      return "c-button-secondary"
  }
}

export interface ButtonProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "type"
  > {
  purpose?: ButtonPurpose
}

const Button: React.FC<ButtonProps> = ({
  children,
  purpose,
  className,
  ...otherProps
}) => (
  <button
    className={classnames(
      "c-button c-button-comfortable",
      getPurposeClass(purpose || "primary"),
      className
    )}
    type={purpose === "submit" ? "submit" : "button"}
    {...otherProps}
  >
    {children}
  </button>
)
export default Button
