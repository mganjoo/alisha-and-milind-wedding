import React from "react"
import { Formik, FormikValues, FormikConfig } from "formik"
import { decorate } from "@storybook/addon-actions"
import BaseForm from "../components/form/BaseForm"
import SubmitButton from "../components/form/SubmitButton"

function makeHandleSubmit(label: string) {
  const formValuesArg = decorate([args => args.slice(0, 1)])
  const onSubmit = formValuesArg.action(label)
  return (t: any, s: any) => {
    onSubmit(t, s)
    return Promise.resolve()
  }
}

interface FormikStoryWrapperProps<Values>
  extends Omit<FormikConfig<Values>, "onSubmit"> {}

export default function FormikStoryWrapper<
  Values extends FormikValues = FormikValues
>({ children, ...otherProps }: FormikStoryWrapperProps<Values>) {
  return (
    <Formik onSubmit={makeHandleSubmit("handleSubmit")} {...otherProps}>
      <BaseForm>
        {children}
        <SubmitButton label="Submit" />
      </BaseForm>
    </Formik>
  )
}
