import React from "react"
import { Form } from "formik"
import { NodeManager } from "react-register-nodes"
import FirstErrorFocuser from "./FirstErrorFocuser"

interface BaseFormProps {
  className?: string
}

const BaseForm: React.FC<BaseFormProps> = ({ className, children }) => {
  return (
    <NodeManager>
      <Form className={className} noValidate>
        <FirstErrorFocuser>{children}</FirstErrorFocuser>
      </Form>
    </NodeManager>
  )
}
export default BaseForm
