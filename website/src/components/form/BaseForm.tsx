import React from "react"
import { Form } from "formik"
import { NodeManager } from "react-register-nodes"
import FirstErrorFocuser from "./FirstErrorFocuser"

interface BaseFormProps {
  className?: string
}

const BaseForm: React.FC<BaseFormProps> = ({ className, children }) => (
  <Form className={className} noValidate>
    <NodeManager>
      <FirstErrorFocuser>{children}</FirstErrorFocuser>
    </NodeManager>
  </Form>
)

export default BaseForm
