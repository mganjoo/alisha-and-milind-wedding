import React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import Form, { EmailValidator, RequiredValidator } from "../src/components/Form"

const name = {
  name: "name",
  label: "Name",
  type: "text",
  validator: RequiredValidator,
}
const email = {
  name: "email",
  label: "Email",
  type: "email",
  validator: EmailValidator,
}
const mailingAddress = {
  name: "mailingAddress",
  label: "Mailing address",
  type: "textarea",
  validator: RequiredValidator,
  rows: 3,
}

const defaultFieldConfigs = [name, email, mailingAddress]
const handleSubmit = submission =>
  new Promise(resolve => {
    action("onSubmit")(submission)
    resolve()
  })

storiesOf("Form", module)
  .addDecorator(story => <div className="max-w-sm font-serif">{story()}</div>)
  .add("default", () => (
    <Form fieldConfigs={defaultFieldConfigs} handleSubmit={handleSubmit} />
  ))
