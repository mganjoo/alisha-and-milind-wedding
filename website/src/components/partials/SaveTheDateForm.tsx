import React, { useState } from "react"
import { Formik } from "formik"
import { object, string } from "yup"
import Alert from "../ui/Alert"
import { loadFirestore } from "../../services/Firestore"
import ContactEmail from "./ContactEmail"
import LabelledTextInput from "../form/LabelledTextInput"
import SubmitButton from "../form/SubmitButton"
import BaseForm from "../form/BaseForm"
import classnames from "classnames"
import { Contact } from "../../interfaces/Contact"
import Symbol from "../ui/Symbol"
import SaveTheDateLinks from "./SaveTheDateLinks"
import ButtonRow from "../form/ButtonRow"

const validationSchema = object<Contact>({
  name: string().required("Name is required."),
  email: string()
    .email("A valid email is required.")
    .required("A valid email is required."),
})

const initialValues: Contact = {
  name: "",
  email: "",
}

const SaveTheDateForm: React.FC = () => {
  const [submitError, setSubmitError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submitInfo(values: Contact) {
    return loadFirestore()
      .then(firestore => firestore.addWithTimestamp("contacts", values))
      .then(() => setSubmitted(true))
      .catch(() => setSubmitError(true))
  }

  return (
    <section
      className="relative"
      aria-label="Confirm contact details"
      aria-describedby="save-the-date-instructions"
    >
      {/* Padding needed at bottom for confirmation page to fit properly */}
      <div
        className={classnames("lg:pb-16", {
          "hidden lg:block lg:invisible": submitted,
        })}
      >
        <div className="c-article text-center mb-6">
          <p id="save-the-date-instructions">
            We&apos;re going green! Please confirm your preferred email address
            for the digital invitation to follow.
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitInfo}
        >
          <BaseForm>
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
            <ButtonRow shadow>
              <SubmitButton label="Submit info" />
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
      {submitted && (
        <div
          role="status"
          className="flex flex-col text-center items-center lg:absolute lg:inset-0"
        >
          <Symbol
            symbol="check"
            className="text-green-700"
            svgClassName="w-12 h-12"
          />
          <div className="c-article my-4">
            <p>
              Thank you for confirming your email! Stay tuned for the invitation
              and wedding website.
            </p>
            <p>We&apos;re so excited to celebrate with you!</p>
          </div>
          <SaveTheDateLinks />
        </div>
      )}
    </section>
  )
}
export default SaveTheDateForm
