import classnames from "classnames"
import React from "react"

type ButtonPurpose = "submit" | "primary" | "secondary" | "tertiary"
type ButtonFit = "comfortable" | "compact"

function getPurposeClass(purpose: ButtonPurpose) {
  switch (purpose) {
    case "submit":
    case "primary":
      return "c-button-primary"
    case "secondary":
      return "c-button-secondary"
    case "tertiary":
      return "c-button-tertiary"
  }
}

function getFitClass(fit: ButtonFit) {
  switch (fit) {
    case "comfortable":
      return "c-button-comfortable"
    case "compact":
      return "c-button-compact"
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
  fit?: ButtonFit
}

const Button: React.FC<ButtonProps> = ({
  children,
  purpose,
  fit,
  className,
  ...otherProps
}) => (
  <button
    className={classnames(
      "c-button",
      getFitClass(fit || "comfortable"),
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
