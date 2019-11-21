import React, { useState, useEffect, createContext, useMemo } from "react"
import {
  fetchAndSaveInvitation,
  loadSavedInvitation,
} from "../../services/Invitation"
import Loading from "../ui/Loading"
import Alert from "../form/Alert"
import ContactEmail from "./ContactEmail"
import { Formik } from "formik"
import { object, string } from "yup"
import BaseForm from "../form/BaseForm"
import LabelledTextInput from "../form/LabelledTextInput"
import SubmitButton from "../form/SubmitButton"
import { Invitation } from "../../interfaces/Invitation"

interface LoginFormValues {
  code: string
}

const initialValues: LoginFormValues = {
  code: "",
}

interface InvitationContextWrapper {
  invitation: Invitation

  /**
   * Force a refetch from server (no change to current invitation if unsuccessful)
   */
  refetch: () => Promise<void>

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
}

const fallbackInvitationContextWrapper: InvitationContextWrapper = {
  invitation: fallbackInvitation,
  refetch: () => new Promise(() => console.log("unsupported operation")),
  reloadSaved: () => new Promise(() => console.log("unsupported operation")),
}
export const InvitationContext = createContext<InvitationContextWrapper>(
  fallbackInvitationContextWrapper
)

interface AuthenticatedProps {
  initialCode?: string
}

const Authenticated: React.FC<AuthenticatedProps> = ({
  children,
  initialCode,
}) => {
  const [didInitialFetch, setDidInitialFetch] = useState(false)
  const [initialFetchError, setInitialFetchError] = useState(false)
  const [invitation, setInvitation] = useState<Invitation>()

  useEffect(() => {
    const loadedInvitationPromise = initialCode
      ? fetchAndSaveInvitation(initialCode)
      : Promise.resolve(undefined)
    loadedInvitationPromise
      .then(loadedInvitation => loadedInvitation || loadSavedInvitation(true))
      .then(loadedInvitation => setInvitation(loadedInvitation))
      .catch(() => setInitialFetchError(true))
      .finally(() => setDidInitialFetch(true))
  }, [initialCode])
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
  const refetchInvitation = useMemo(
    () => async () => {
      if (invitation) {
        const fetched = await fetchAndSaveInvitation(invitation.code)
        if (fetched) {
          setInvitation(fetched)
        }
      }
    },
    [invitation]
  )

  const isError = initialFetchError || submitError
  const isMissing =
    !isError && (initialCode !== undefined || submitted) && !invitation

  if (invitation) {
    const invitationContextWrapper: InvitationContextWrapper = {
      invitation: invitation,
      refetch: refetchInvitation,
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
        validationSchema={object({
          code: string().required("Please enter your invitation code."),
        })}
        onSubmit={login}
      >
        <BaseForm className="max-w-sm w-full mt-3 mb-8 border rounded-lg p-6 border-gray-400">
          <div className="font-serif">
            <p>
              To view this page, please use the invitation code included in your
              wedding invitation email.
            </p>
          </div>
          {(isError || isMissing) && (
            <Alert className="mt-4">
              {isError && "There was an error retrieving your invitation. "}
              {isMissing && "Hmm, we couldn't find that invitation code. "}
              Please try again, or email us at <ContactEmail />.
            </Alert>
          )}
          <div className="mt-6">
            <LabelledTextInput
              name="code"
              type="text"
              label="Invitation code"
            />
            <SubmitButton label="Submit" className="mt-4" />
          </div>
        </BaseForm>
      </Formik>
    )
  }
}
export default Authenticated
