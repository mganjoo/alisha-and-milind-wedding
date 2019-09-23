import React, { useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import Img from "gatsby-image"
import SEO from "../components/SEO"
import BaseLayout from "../components/BaseLayout"
import {
  useForm,
  RequiredValidator,
  FieldsMap,
  SubmissionMap,
} from "../components/Form"
import { useFirestore } from "../services/Firebase"
import ValidationError from "../components/ValidationError"

const countries = [
  "United States",
  "Australia",
  "Canada",
  "France",
  "India",
  "United Kingdom",
]

const fields: FieldsMap = {
  name: { validators: [RequiredValidator] },
  email: { validators: [RequiredValidator] },
  address: { validators: [RequiredValidator] },
  city: { validators: [RequiredValidator] },
  state: { validators: [RequiredValidator] },
  zip: { validators: [RequiredValidator] },
  country: { validators: [RequiredValidator], initialValue: "United States" },
}

type SubmissionStatus = "none" | "submission-error" | "submitted"

export default function SaveTheDatePage() {
  const imageData = useStaticQuery(
    graphql`
      query {
        weddingHeroImage: file(relativePath: { eq: "save-the-date-hero.jpg" }) {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `
  )
  const firestore = useFirestore()
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    "none"
  )

  async function submitInfo(submission: SubmissionMap) {
    if (firestore != null) {
      console.log("Submitting: ", submission)
      return firestore
        .addWithTimestamp("contactDetails", submission)
        .then(docRef => {
          console.log(`Document added: ${docRef.id}`)
          setSubmissionStatus("submitted")
        })
        .catch(error => {
          console.error("Error adding document: ", error)
          setSubmissionStatus("submission-error")
        })
    } else {
      return Promise.resolve()
    }
  }
  const {
    values,
    dirty,
    submitting,
    handleChange,
    handleBlur,
    handleSubmit,
    registerRef,
  } = useForm(fields, submitInfo)

  return (
    <BaseLayout>
      <SEO title="Save the Date" />
      <main className="lg:flex lg:flex-row-reverse">
        <Img
          className="constrained-hero flex-1"
          fluid={imageData.weddingHeroImage.childImageSharp.fluid}
          alt="Selfie of Milind and Alisha through a car side mirror"
          imgStyle={{ objectPosition: "36% 50%" }}
        />
        <div className="flex-none mx-auto max-w-lg lg:max-w-md xl:max-w-lg">
          <div className="text-center">
            <h1 className="mt-3 font-script text-5xl text-orange-900">
              Save the Date
            </h1>
            <div>
              <svg
                className="inline-block text-gray-600 stroke-current"
                width="70"
                height="28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M54.843 10.9c-3.615 2.051-6.843 3.81-9.798 5.273m9.798-5.272C56.666 1 68.99 3.516 68.99 3.516s.437 4.194-4.456 5.452c-4.894 1.258-4.894-.42-9.69 1.933zm0 0s3.522-4.869 6.922-4.45M1 6.452c5.78 5.347 6.834 5.94 14.025 9.355m30.02.367c.995 9.569 13.994 3.522 16.295 2.02-4.258-2.622-9.556-.245-16.295-2.02zm0 0c2.903-5.16 2.886-11.09 0-15.173-2.888 4.439-2.91 10.371 0 15.173zm0 0c-5.86 1.578-10.748 2.29-15.155 2.16m0 0c.238-.27 10.2 2.796 5.525 8.667-1.7-1.677-7.65-4.613-5.525-8.666zm0 0c4.138-3.668 4.452-8.55 1.7-11.881-2.183 4.265-2.595 6.857-1.7 11.882zm0 0c-3.353-.097-10.249-1.333-14.865-2.527m0 0c2.574 3.195 4.386 3.486 2.125 8.678-2.91-4.533-4.308-4.42-2.125-8.678zm0 0c6.161-2.433 5.466-6.73 6.375-6.838 2.586 5.077.425 6.838-6.375 6.838z" />
              </svg>
            </div>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl tracking-wide">
              Alisha &amp; Milind
            </h2>
            <h3 className="mt-2 font-sans uppercase text-2xl">May 1-2, 2020</h3>
            <h4 className="font-sans uppercase text-lg">San Mateo, CA</h4>
            <hr className="mt-5 inline-block w-24 border-gray-400" />
          </div>
          <div className="relative">
            <div
              className={
                submissionStatus === "submitted" ? "invisible" : undefined
              }
            >
              <p className="mt-3 px-10 text-center font-serif text-lg">
                Please confirm your email and mailing address! Formal invitation
                to follow.
              </p>
              <form
                className="flex flex-col items-center px-8 pt-4 pb-6 form-shared"
                onSubmit={handleSubmit}
              >
                {submissionStatus === "submission-error" && !submitting && (
                  <div className="alert">
                    Something went wrong during submission. Please{" "}
                    <a href="mailto:alisha.and.milind@gmail.com">contact us</a>{" "}
                    if you continue having trouble.
                  </div>
                )}
                <label className="w-full">
                  <span className="label">Name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={registerRef}
                    className={dirty.name ? "invalid" : ""}
                  />
                  <ValidationError
                    error={dirty.name}
                    message="Name is required."
                  />
                </label>
                <label className="w-full">
                  <span className="label">Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={registerRef}
                    className={dirty.email ? "invalid" : ""}
                  />
                  <ValidationError
                    error={dirty.email}
                    message="Email is required."
                  />
                </label>
                <div className="flex flex-wrap justify-between">
                  <label className="w-full">
                    <span className="label">Street address</span>
                    <input
                      type="text"
                      name="address"
                      autoComplete="street-address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      ref={registerRef}
                      className={dirty.address ? "invalid" : ""}
                    />
                    <ValidationError
                      error={dirty.address}
                      message="Street address is required."
                    />
                  </label>
                  <label className="w-full">
                    <span className="label">City</span>
                    <input
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      ref={registerRef}
                      className={dirty.city ? "invalid" : ""}
                    />
                    <ValidationError
                      error={dirty.city}
                      message="City is required."
                    />
                  </label>
                  <label className="w-7/12">
                    <span className="label">State</span>
                    <input
                      type="text"
                      name="state"
                      autoComplete="address-level1"
                      value={values.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      ref={registerRef}
                      className={dirty.state ? "invalid" : ""}
                    />
                  </label>
                  <label className="w-2/5">
                    <span className="label">ZIP/Postal code</span>
                    <input
                      type="text"
                      name="zip"
                      autoComplete="postal-code"
                      value={values.zip}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      ref={registerRef}
                      className={dirty.zip ? "invalid" : ""}
                    />
                  </label>
                  <ValidationError
                    error={dirty.state || dirty.zip}
                    message="State &amp; postal code are required."
                    standalone={true}
                  />
                  <label className="w-full">
                    <span className="label">Country</span>
                    <input
                      type="text"
                      name="country"
                      autoComplete="country"
                      value={values.country}
                      list="countries"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      ref={registerRef}
                      className={dirty.country ? "invalid" : ""}
                    />
                    <datalist id="countries">
                      {countries.map(country => (
                        <option value={country} key={country} />
                      ))}
                    </datalist>
                    <ValidationError
                      error={dirty.country}
                      message="Country is required."
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  className="button mt-6"
                  disabled={!firestore || submitting}
                >
                  {submitting ? "Submitting..." : "Submit info"}
                </button>
              </form>
            </div>
            {submissionStatus === "submitted" && (
              <div className="absolute inset-0 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="w-12 mt-24 fill-current text-green-700"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z" />
                </svg>
                <p className="text-center px-16 mt-4 text-xl">
                  Thank you for confirming your details! Stay tuned for the full
                  wedding website &mdash; we can&apos;t wait to celebrate with
                  you!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </BaseLayout>
  )
}
