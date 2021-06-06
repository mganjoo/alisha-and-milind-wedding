import { action } from "@storybook/addon-actions"
import { Formik, FormikValues, FormikConfig } from "formik"
import React from "react"
import BaseForm from "../components/form/BaseForm"
import SubmitButton from "../components/form/SubmitButton"
interface FormikStoryWrapperProps<Values>
  extends Omit<FormikConfig<Values>, "onSubmit"> {}

export default function FormikStoryWrapper<
  Values extends FormikValues = FormikValues
>({ children, ...otherProps }: FormikStoryWrapperProps<Values>) {
  return (
    <Formik onSubmit={action("submit")} {...otherProps}>
      <BaseForm>
        {children}
        <SubmitButton label="Submit" />
      </BaseForm>
    </Formik>
  )
}
