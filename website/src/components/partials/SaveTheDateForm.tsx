import React, { useState } from "react"
import { Formik } from "formik"
import { object, string } from "yup"
import Alert from "../form/Alert"
import { loadFirestore } from "../../services/Firestore"
import ContactEmail from "./ContactEmail"
import LabelledTextInput from "../form/LabelledTextInput"
import SubmitButton from "../form/SubmitButton"
import BaseForm from "../form/BaseForm"
import classnames from "classnames"
import { useStaticQuery, graphql } from "gatsby"
import AddToCalendarLinks from "../ui/AddToCalendarLinks"
import { Contact } from "@alisha-and-milind-wedding/shared-types"
import Symbol from "../ui/Symbol"

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
  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            siteUrl
            location
          }
        }
      }
    `
  )
  const [submitError, setSubmitError] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function submitInfo(values: Contact) {
    return loadFirestore()
      .then(firestore => firestore.addWithTimestamp("contacts", values))
      .then(() => setSubmitted(true))
      .catch(() => setSubmitError(true))
  }

  return (
    <>
      <div
        className={classnames({
          "hidden lg:block lg:invisible": submitted,
        })}
      >
        <p className="c-body-text text-center" id="save-the-date-instructions">
          We&apos;re going green! Please confirm your preferred email address
          for the digital invitation to follow.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitInfo}
        >
          {/* Padding needed here for confirmation page to work */}
          <BaseForm className="flex flex-col items-center pt-4 pb-16 lg:pb-20">
            <div className="w-full mb-6">
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
            <SubmitButton label="Submit info" className="shadow-lg" />
            {submitError && (
              <Alert className="mt-8">
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
          <Symbol symbol="check" className="w-12 h-12 mb-4 text-green-700" />
          <div className="c-article mb-2">
            <p>
              Thank you for confirming your email! Stay tuned for the invitation
              and wedding website.
            </p>
            <p>We&apos;re so excited to celebrate with you!</p>
          </div>
          <AddToCalendarLinks
            label="Add dates to calendar"
            event={{
              title: "Alisha & Milind's Wedding Weekend",
              location: data.site.siteMetadata.location,
              description: `Save the date for Alisha & Milind's wedding! More details to come at ${data.site.siteMetadata.siteUrl}`,
              startTime: "2020-05-01T00:00:00-07:00",
              endTime: "2020-05-03T00:00:00-07:00",
              allDay: true,
              url: data.site.siteMetadata.siteUrl,
            }}
          />
        </div>
      )}
    </>
  )
}
export default SaveTheDateForm
