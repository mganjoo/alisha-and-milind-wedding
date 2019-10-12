import React from "react"
import classnames from "classnames"

interface AlertProps {
  className?: string
}

const Alert: React.FunctionComponent<AlertProps> = ({
  className,
  children,
}) => (
  <div className={classnames("c-alert", className)} role="alert">
    {children}
  </div>
)
export default Alert
