import React, { useState } from "react"
import { Formik } from "formik"
import { object, string } from "yup"
import Alert from "../form/Alert"
import { useFirestore } from "../../services/Firebase"
import ContactEmail from "./ContactEmail"
import LabelledTextInput from "../form/LabelledTextInput"
import SubmitButton from "../form/SubmitButton"
import { createSubmitFunction } from "../utils/Utils"
import BaseForm from "../form/BaseForm"

interface SaveTheDateFormValues {
  name: string
  email: string
}

interface SaveTheDateFormProps {
  onSubmit: () => void
}

const SaveTheDateForm: React.FC<SaveTheDateFormProps> = ({ onSubmit }) => {
  const firestore = useFirestore()
  const [submitError, setSubmitError] = useState(false)

  async function submitInfo(values: SaveTheDateFormValues) {
    if (firestore) {
      return firestore
        .addWithTimestamp("contacts", values)
        .then(() => onSubmit())
        .catch(() => setSubmitError(true))
    } else {
      return Promise.resolve()
    }
  }

  const initialValues: SaveTheDateFormValues = {
    name: "",
    email: "",
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={object({
        name: string().required("Name is required."),
        email: string()
          .email("A valid email is required.")
          .required("A valid email is required."),
      })}
      onSubmit={createSubmitFunction(submitInfo)}
    >
      <BaseForm className="flex flex-col items-center pb-8 lg:pb-16">
        {submitError && (
          <Alert className="my-3 mx-4 lg:mx-2">
            There was a problem submitting your info. Please email us at{" "}
            <ContactEmail />.
          </Alert>
        )}
        <div className="flex flex-wrap justify-between">
          <LabelledTextInput
            label="Name"
            name="name"
            type="text"
            autoComplete="name"
          />
          <LabelledTextInput
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
          />
        </div>
        <SubmitButton
          label="Submit info"
          className="mt-8 mb-2"
          loading={!firestore}
        />
      </BaseForm>
    </Formik>
  )
}
export default SaveTheDateForm
