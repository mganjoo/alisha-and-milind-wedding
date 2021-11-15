import { Form } from "formik"
import React from "react"
import { NodeManager } from "../../utils/RegisterNodes"
import FirstErrorFocuser from "./FirstErrorFocuser"

const BaseForm: React.FC = ({ children }) => (
  <Form noValidate>
    <NodeManager>
      <FirstErrorFocuser>{children}</FirstErrorFocuser>
    </NodeManager>
  </Form>
)

export default BaseForm
