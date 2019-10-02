import React from "react"

const Alert: React.FunctionComponent<{}> = ({ children }) => (
  <div className="c-alert" role="alert">
    {children}
  </div>
)
export default Alert
