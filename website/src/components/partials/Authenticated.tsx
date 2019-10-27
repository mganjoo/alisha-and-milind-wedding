import React, { useState, useEffect, createContext } from "react"
import {
  useForm,
  FieldConfig,
  SimpleValidator,
  SubmissionMap,
} from "../form/Form"
import { NonEmpty } from "../form/ValidatorPredicate"
import Input from "../form/Input"
import {
  fetchAndSaveInvitation,
  Invitation,
  loadSavedInvitation,
} from "../../services/Invitation"
import LabelWrapper from "../form/LabelWrapper"
import Loading from "../ui/Loading"
import Alert from "../form/Alert"
import Button from "../ui/Button"

const fields: FieldConfig[] = [
  {
    name: "code",
    validator: SimpleValidator(NonEmpty, "Please enter your invitation code."),
  },
]

// Used only to seed the context for cases when there is no provider
const FallbackInvitation: Invitation = {
  code: "abcdefgh",
  partyName: "Doug Peterson & Family",
  guests: ["Doug Peterson Jones", "Betty Draper"],
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

  async function login(submission: SubmissionMap) {
    setInitialFetchError(false) // after first submit, form will handle error handling
    const value = await fetchAndSaveInvitation(submission.code)
    setInvitation(value)
  }
  const {
    values,
    errors,
    formStatus,
    handleBlur,
    handleChange,
    handleSubmit,
    registerRef,
  } = useForm(fields, login)

  const isError = initialFetchError || formStatus === "error"
  const isMissing =
    (initialCode !== undefined || formStatus === "submitted") && !invitation

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
      <form onSubmit={handleSubmit}>
        {(isError || isMissing) && (
          <Alert>
            {isError && "There was an error retrieving your invitation. "}
            {isMissing && "Hmm, we couldn't find that invitation code. "}
            Please email us at{" "}
            <a href="mailto:alisha.and.milind@gmail.com">
              alisha.and.milind@gmail.com
            </a>
          </Alert>
        )}
        <LabelWrapper label="Invitation code" errorMessage={errors.code}>
          <Input
            name="code"
            type="text"
            value={values.code}
            onChange={handleChange}
            onBlur={handleBlur}
            ref={registerRef}
            invalid={errors.code !== null}
          />
          <Button disabled={formStatus === "submitting"}>
            {formStatus === "submitting" ? "Submitting..." : "Submit"}
          </Button>
        </LabelWrapper>
      </form>
    )
  }
}
export default Authenticated
