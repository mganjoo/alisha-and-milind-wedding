import { Formik } from "formik"
import React, { useState, useEffect, createContext, useMemo } from "react"
import { object, string, SchemaOf } from "yup"
import { Invitation } from "../../interfaces/Invitation"
import {
  loadSavedInvitation,
  fetchAndSaveInvitationByEmail,
} from "../../services/Invitation"
import BaseForm from "../form/BaseForm"
import ButtonRow from "../form/ButtonRow"
import LabelledTextField from "../form/LabelledTextField"
import SubmitButton from "../form/SubmitButton"
import Alert from "../ui/Alert"
import Loading from "../ui/Loading"
import ContactEmail from "./ContactEmail"

interface LoginFormValues {
  email: string
}

const initialValues: LoginFormValues = {
  email: "",
}

const validationSchema: SchemaOf<LoginFormValues> = object({
  email: string()
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
})

export interface InvitationContextWrapper {
  invitation: Invitation

  /**
   * Force a reload from cache (no change to current invitation if unsuccessful).
   *
   * Optionally forces refetch from server if invitation was last fetched `olderThanSecs` seconds ago.
   * Optionally loads from `forcedInvitation` if set.
   * Propagates errors on fetch failure.
   */
  reloadSaved: (args?: {
    olderThanSecs?: number
    forcedInvitation?: Invitation
  }) => Promise<void>
}

// Used only to seed the context for cases when there is no provider
const fallbackInvitation: Invitation = {
  code: "abcdefgh",
  partyName: "Doug Peterson & Family",
  numGuests: 2,
  knownGuests: ["Doug Peterson Jones", "Betty Draper"],
  itype: "a",
}

export function makeDummyInvitationContextWrapper(
  invitation: Invitation
): InvitationContextWrapper {
  return {
    invitation: invitation,
    reloadSaved: (_args?: {
      olderThanSecs?: number
      forcedInvitation?: Invitation
    }) => Promise.resolve(),
  }
}

const fallbackInvitationContextWrapper: InvitationContextWrapper =
  makeDummyInvitationContextWrapper(fallbackInvitation)
export const InvitationContext = createContext<InvitationContextWrapper>(
  fallbackInvitationContextWrapper
)

const Authenticated: React.FC = ({ children }) => {
  const [didInitialFetch, setDidInitialFetch] = useState(false)
  const [initialFetchError, setInitialFetchError] = useState(false)
  const [invitation, setInvitation] = useState<Invitation>()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    loadSavedInvitation()
      .then((loadedInvitation) => setInvitation(loadedInvitation))
      .catch(() => setInitialFetchError(true))
      .finally(() => setDidInitialFetch(true))
  }, [])

  async function login(submission: LoginFormValues) {
    setInitialFetchError(false) // after first submit, form will handle error handling
    setSubmitError(false)
    return fetchAndSaveInvitationByEmail(submission.email)
      .then((invitation) => {
        setInvitation(invitation)
      })
      .then(() => setSubmitted(true))
      .catch(() => setSubmitError(true))
  }

  const loadInvitation = useMemo(
    () =>
      async (args?: {
        olderThanSecs?: number
        forcedInvitation?: Invitation
      }) => {
        if (args?.forcedInvitation) {
          setInvitation(args.forcedInvitation)
        } else {
          const loaded = await loadSavedInvitation(args?.olderThanSecs)
          if (loaded) {
            setInvitation(loaded)
          }
        }
      },
    []
  )

  const isError = initialFetchError || submitError
  const isMissing = !isError && submitted && !invitation
  const showAlert = isError || isMissing

  if (invitation) {
    const invitationContextWrapper: InvitationContextWrapper = {
      invitation: invitation,
      reloadSaved: loadInvitation,
    }
    return (
      <InvitationContext.Provider value={invitationContextWrapper}>
        {children}
      </InvitationContext.Provider>
    )
  } else if (!didInitialFetch) {
    return <Loading />
  } else {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={login}
      >
        {({ isSubmitting }) => (
          <div
            role="dialog"
            aria-label="Enter email"
            aria-describedby="authenticated-description"
            className="max-w-sm mx-auto"
          >
            <div className="mx-4 my-6 c-shadow-box">
              <BaseForm>
                {!isSubmitting && showAlert && (
                  <Alert>
                    {isError &&
                      "There was an error retrieving your invitation. "}
                    {isMissing &&
                      "Hmm, we couldn???t find an invitation under that email. "}
                    Please try again, or email us at <ContactEmail />.
                  </Alert>
                )}
                <p
                  className="c-form-description"
                  id="authenticated-description"
                >
                  To view this page, please enter the email address that your
                  invitation was sent to.
                </p>
                <LabelledTextField
                  name="email"
                  type="email"
                  label="Email address"
                  autoComplete="email"
                />
                <ButtonRow>
                  <SubmitButton label="Submit" />
                </ButtonRow>
              </BaseForm>
            </div>
          </div>
        )}
      </Formik>
    )
  }
}
export default Authenticated
