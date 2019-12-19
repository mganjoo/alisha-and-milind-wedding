import React, { useState, useEffect, createContext, useMemo } from "react"
import {
  fetchAndSaveInvitation,
  loadSavedInvitation,
} from "../../services/Invitation"
import Loading from "../ui/Loading"
import Alert from "../ui/Alert"
import ContactEmail from "./ContactEmail"
import { Formik } from "formik"
import { object, string } from "yup"
import BaseForm from "../form/BaseForm"
import LabelledTextInput from "../form/LabelledTextInput"
import SubmitButton from "../form/SubmitButton"
import { Invitation } from "../../interfaces/Invitation"
import ButtonRow from "../form/ButtonRow"

interface LoginFormValues {
  code: string
}

const initialValues: LoginFormValues = {
  code: "",
}

const validationSchema = object<LoginFormValues>({
  code: string().required("Please enter your invitation code."),
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

  useEffect(() => {
    const loadedInvitationPromise = initialCode
      ? fetchAndSaveInvitation(initialCode)
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
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  async function login(submission: LoginFormValues) {
    setInitialFetchError(false) // after first submit, form will handle error handling
    return fetchAndSaveInvitation(submission.code)
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
  const isMissing =
    !isError && (initialCode !== undefined || submitted) && !invitation

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
        <div
          role="dialog"
          aria-label="Enter code"
          aria-describedby="enter-code-description"
          className="max-w-sm mx-auto my-6 text-center c-shadow-box"
        >
          <BaseForm>
            <p className="c-form-description" id="enter-code-description">
              To view this page, please use the invitation code included in your
              wedding invitation email.
            </p>
            {(isError || isMissing) && (
              <Alert>
                {isError && "There was an error retrieving your invitation. "}
                {isMissing && "Hmm, we couldn't find that invitation code. "}
                Please try again, or email us at <ContactEmail />.
              </Alert>
            )}
            <LabelledTextInput
              name="code"
              type="text"
              label="Invitation code"
              autoCapitalize="none"
              autoCorrect="off"
            />
            <ButtonRow shadow>
              <SubmitButton label="Submit" />
            </ButtonRow>
          </BaseForm>
        </div>
      </Formik>
    )
  }
}
export default Authenticated
