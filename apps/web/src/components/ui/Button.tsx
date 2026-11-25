import clsx from "clsx"
import type { ComponentProps } from "react"

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

export interface ButtonProps extends Omit<ComponentProps<"button">, "type"> {
  purpose?: ButtonPurpose
}

const Button = ({
  children,
  purpose,
  className,
  ...otherProps
}: ButtonProps) => (
  <button
    className={clsx(
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
