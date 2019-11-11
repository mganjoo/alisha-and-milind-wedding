import React, { useRef, useEffect } from "react"
import { Form, useFormikContext } from "formik"
import { NodeManager, useOrderedNodes } from "react-register-nodes"

interface BaseFormProps {
  className?: string
}

const FirstErrorFocuser: React.FC = ({ children }) => {
  const formik = useFormikContext()
  const prevSubmitCountRef = useRef(formik.submitCount)
  const ordered = useOrderedNodes()

  useEffect(() => {
    if (
      prevSubmitCountRef.current !== formik.submitCount &&
      !formik.isValid &&
      ordered.length > 0
    ) {
      prevSubmitCountRef.current = formik.submitCount
      ordered[0].focus()
    }
  }, [formik.isValid, formik.submitCount, ordered])

  return <>{children}</>
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
