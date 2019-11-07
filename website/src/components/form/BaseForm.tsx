import React from "react"
import { Form } from "formik"
import { useFocusFirstError } from "../utils/UtilHooks"

interface BaseFormProps {
  className?: string
}

interface BaseFormHelpers {
  registerRef: (elem: HTMLInputElement) => void
}

const defaultContext: BaseFormHelpers = {
  registerRef: () => console.error("Form was not wrapped in BaseFormContext"),
}

export const BaseFormHelpersContext = React.createContext(defaultContext)

const BaseForm: React.FC<BaseFormProps> = ({ className, children }) => {
  const registerRef = useFocusFirstError()
  return (
    <Form className={className} noValidate>
      <BaseFormHelpersContext.Provider value={{ registerRef }}>
        {children}
      </BaseFormHelpersContext.Provider>
    </Form>
  )
}
export default BaseForm
