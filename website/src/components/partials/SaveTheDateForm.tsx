import { Formik } from "formik"
import { navigate } from "gatsby"
import React, { useState, useEffect } from "react"
import { object, string, SchemaOf } from "yup"
import { Contact } from "../../interfaces/Contact"
import { loadFirestore } from "../../services/Firestore"
import BaseForm from "../form/BaseForm"
import ButtonRow from "../form/ButtonRow"
import LabelledTextField from "../form/LabelledTextField"
import SubmitButton from "../form/SubmitButton"
import Alert from "../ui/Alert"
import Symbol from "../ui/Symbol"
import ContactEmail from "./ContactEmail"
import SaveTheDateLinks from "./SaveTheDateLinks"

const validationSchema: SchemaOf<Contact> = object({
  name: string().required("Name is required."),
  email: string()
    .email("A valid email is required.")
    .required("A valid email is required."),
})

const initialValues: Contact = {
  name: "",
  email: "",
}

interface SaveTheDateFormProps {
  redirect?: boolean
}

const SaveTheDateForm: React.FC<SaveTheDateFormProps> = ({ redirect }) => {
  const [submitError, setSubmitError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (submitted && redirect) {
      navigate("/")
    }
  }, [submitted, redirect])

  async function submitInfo(values: Contact) {
    return loadFirestore()
      .then((firestore) => firestore.addWithTimestamp("contacts", values))
      .then(() => setSubmitted(true))
      .catch(() => setSubmitError(true))
  }

  return (
    <section
      className="relative"
      aria-label="Confirm contact details"
      aria-describedby="save-the-date-instructions"
    >
      {!submitted && (
        <div>
          <div className="c-article text-center">
            <p id="save-the-date-instructions">
              We&rsquo;re going green! Please confirm your preferred email
              address for the digital invitation to follow.
            </p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitInfo}
          >
            <BaseForm>
              <LabelledTextField
                label="Name"
                name="name"
                type="text"
                autoComplete="name"
              />
              <LabelledTextField
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
              />
              <ButtonRow>
                <SubmitButton
                  label={
                    submitted
                      ? "Submitted!"
                      : redirect
                      ? "Submit and go to website"
                      : "Submit info"
                  }
                  forceDisabled={submitted}
                />
              </ButtonRow>
              {submitError && (
                <Alert>
                  There was a problem submitting your info. Please email us at{" "}
                  <ContactEmail />.
                </Alert>
              )}
            </BaseForm>
          </Formik>
        </div>
      )}
      {submitted && !redirect && (
        <div role="status" className="flex flex-col text-center items-center">
          <Symbol
            symbol="check"
            className="text-green-700 mb-4 dark:text-green-500"
            size="l"
          />
          <div className="c-article">
            <p>
              Thank you for confirming your email! Stay tuned for the invitation
              and wedding website.
            </p>
            <p>We&rsquo;re so excited to celebrate with you!</p>
          </div>
          <SaveTheDateLinks />
        </div>
      )}
    </section>
  )
}
export default SaveTheDateForm
