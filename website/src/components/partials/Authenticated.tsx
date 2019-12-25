import { Formik } from "formik"
import React, { useState, useEffect, createContext, useMemo } from "react"
import { object, string } from "yup"
import { Invitation } from "../../interfaces/Invitation"
import {
  fetchAndSaveInvitationByCode,
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

const validationSchema = object<LoginFormValues>({
  email: string()
    .email("Please enter a valid email.")
    .required("Please enter a valid email."),
})

export interface InvitationContextWrapper {
  invitation: Invitation

  /**
   * Force a reload from cache (no change to current invitation if unsuccessful)
   */
  reloadSaved: () => Promise<void>
}

// Used only to seed the context for cases when there is no provider
const fallbackInvitation: Invitation = {
  code: "abcdefgh",
  partyName: "Doug Peterson & Family",
  numGuests: 2,
  knownGuests: ["Doug Peterson Jones", "Betty Draper"],
  preEvents: true,
}

export function makeDummyInvitationContextWrapper(
  invitation: Invitation
): InvitationContextWrapper {
  return {
    invitation: invitation,
    reloadSaved: () => Promise.resolve(),
  }
}

const fallbackInvitationContextWrapper: InvitationContextWrapper = makeDummyInvitationContextWrapper(
  fallbackInvitation
)
export const InvitationContext = createContext<InvitationContextWrapper>(
  fallbackInvitationContextWrapper
)

interface AuthenticatedProps {
  initialCode?: string
  refreshOlderThanSecs?: number
}

const Authenticated: React.FC<AuthenticatedProps> = ({
  children,
  initialCode,
  refreshOlderThanSecs = 0,
}) => {
  const [didInitialFetch, setDidInitialFetch] = useState(false)
  const [initialFetchError, setInitialFetchError] = useState(false)
  const [invitation, setInvitation] = useState<Invitation>()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    const loadedInvitationPromise = initialCode
      ? fetchAndSaveInvitationByCode(initialCode, true)
      : Promise.resolve(undefined)
    loadedInvitationPromise
      .then(
        loadedInvitation =>
          loadedInvitation || loadSavedInvitation(refreshOlderThanSecs)
      )
      .then(loadedInvitation => setInvitation(loadedInvitation))
      .catch(() => setInitialFetchError(true))
      .finally(() => setDidInitialFetch(true))
  }, [initialCode, refreshOlderThanSecs])

  async function login(submission: LoginFormValues) {
    setInitialFetchError(false) // after first submit, form will handle error handling
    setSubmitError(false)
    return fetchAndSaveInvitationByEmail(submission.email)
      .then(setInvitation)
      .then(() => setSubmitted(true))
      .catch(() => setSubmitError(true))
  }

  const loadInvitation = useMemo(
    () => async () => {
      const loaded = await loadSavedInvitation()
      if (loaded) {
        setInvitation(loaded)
      }
    },
    []
  )

  const isError = initialFetchError || submitError
  const isMissing = !isError && submitted && !invitation
  const isInitialMissing =
    !isError && !isMissing && initialCode !== undefined && !invitation
  const showAlert = isError || isMissing || isInitialMissing

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
            <div className="c-shadow-box mx-4 my-6">
              <BaseForm>
                {!isSubmitting && showAlert && (
                  <Alert>
                    {isError &&
                      "There was an error retrieving your invitation. "}
                    {isInitialMissing &&
                      "Hmm, we couldn’t find that invitation code. "}
                    {isMissing &&
                      "Hmm, we couldn’t find an invitation under that email. "}
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
                <ButtonRow shadow>
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
