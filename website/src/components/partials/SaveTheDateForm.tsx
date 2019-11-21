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
import Confirmation from "./Confirmation"
import { useStaticQuery, graphql } from "gatsby"
import AddToCalendarLinks from "../ui/AddToCalendarLinks"

interface SaveTheDateFormValues {
  name: string
  email: string
}

const initialValues: SaveTheDateFormValues = {
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

  async function submitInfo(values: SaveTheDateFormValues) {
    return loadFirestore()
      .then(firestore => firestore.addWithTimestamp("contacts", values))
      .then(() => setSubmitted(true))
      .catch(() => setSubmitError(true))
  }

  return (
    <>
      <div
        className={classnames("c-article px-12 lg:px-16", {
          "hidden lg:block lg:invisible": submitted,
        })}
      >
        <p className="text-center" id="save-the-date-instructions">
          We&apos;re going green! Please confirm your preferred email address
          for the digital invitation to follow.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={object({
            name: string().required("Name is required."),
            email: string()
              .email("A valid email is required.")
              .required("A valid email is required."),
          })}
          onSubmit={submitInfo}
        >
          <BaseForm className="flex flex-col items-center pb-8 lg:pb-16">
            {submitError && (
              <Alert className="my-3 mx-4 lg:mx-2">
                There was a problem submitting your info. Please email us at{" "}
                <ContactEmail />.
              </Alert>
            )}
            <div className="w-full">
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
            <SubmitButton label="Submit info" className="mt-8 mb-2" />
          </BaseForm>
        </Formik>
      </div>
      {submitted && (
        <Confirmation className="flex flex-col text-center px-8 items-center lg:absolute lg:inset-0 lg:px-12">
          <div className="c-article">
            <p>
              Thank you for confirming your email! Stay tuned for the invitation
              and wedding website.
            </p>
            <p>We&apos;re so excited to celebrate with you!</p>
          </div>
          <h2 className="mt-4 mb-2 text-sm font-sans font-semibold">
            Add dates to calendar
          </h2>
          <AddToCalendarLinks
            className="max-w-sm pb-4 lg:max-w-full"
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
        </Confirmation>
      )}
    </>
  )
}
export default SaveTheDateForm
