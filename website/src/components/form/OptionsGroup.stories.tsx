import React from "react"
import { Formik } from "formik"
import BaseForm from "./BaseForm"
import SubmitButton from "./SubmitButton"
import OptionsGroup, { Option } from "./OptionsGroup"
import { decorate } from "@storybook/addon-actions"

export default {
  title: "OptionsGroup",
}

const options: Option[] = [
  {
    label: "Foo",
    value: "foo",
  },
  { label: "Bar", value: "bar" },
  { label: "Baz", value: "baz" },
]

function makeHandleSubmit(label: string) {
  const formValuesArg = decorate([args => args.slice(0, 1)])
  const onSubmit = formValuesArg.action(label)
  return (t: any, s: any) => {
    onSubmit(t, s)
    return Promise.resolve()
  }
}

export const main = () => {
  return (
    <Formik
      initialValues={{ choice: "" }}
      onSubmit={makeHandleSubmit("handleSubmit")}
    >
      <BaseForm>
        <OptionsGroup
          name="choice"
          label="Choose from options"
          type="radio"
          options={options}
        />
        <SubmitButton label="Submit" />
      </BaseForm>
    </Formik>
  )
}
