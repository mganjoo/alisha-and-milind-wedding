import React, { useState, useEffect, createContext } from "react"
import {
  fetchAndSaveInvitation,
  Invitation,
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

interface LoginFormValues {
  code: string
}

const initialValues: LoginFormValues = {
  code: "",
}

// Used only to seed the context for cases when there is no provider
const FallbackInvitation: Invitation = {
  code: "abcdefgh",
  partyName: "Doug Peterson & Family",
  numGuests: 2,
  knownGuests: ["Doug Peterson Jones", "Betty Draper"],
}
export const InvitationContext = createContext<Invitation>(FallbackInvitation)

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
      .then(loadedInvitation => loadedInvitation || loadSavedInvitation())
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

  const isError = initialFetchError || submitError
  const isMissing = (initialCode !== undefined || submitted) && !invitation

  if (invitation) {
    return (
      <InvitationContext.Provider value={invitation}>
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
        <BaseForm>
          {(isError || isMissing) && (
            <Alert>
              {isError && "There was an error retrieving your invitation. "}
              {isMissing && "Hmm, we couldn't find that invitation code. "}
              Please email us at <ContactEmail />.
            </Alert>
          )}
          <LabelledTextInput name="code" type="text" label="Invitation code" />
          <SubmitButton label="Submit" />
        </BaseForm>
      </Formik>
    )
  }
}
export default Authenticated
