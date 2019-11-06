import React, { useState, useEffect, createContext } from "react"
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
import ContactEmail from "./ContactEmail"
import { useFormik, FormikHelpers } from "formik"
import { object, string } from "yup"
import { useFocusFirstError } from "../form/FocusFirstError"

interface LoginFormValues {
  code: string
}

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

  function login(
    submission: LoginFormValues,
    actions: FormikHelpers<LoginFormValues>
  ) {
    setInitialFetchError(false) // after first submit, form will handle error handling
    return fetchAndSaveInvitation(submission.code)
      .then(setInvitation)
      .then(() => actions.setStatus("submitted"))
      .catch(() => actions.setStatus("serverError"))
      .finally(() => actions.setSubmitting(false))
  }

  const initialValues: LoginFormValues = {
    code: "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: object({
      code: string().required("Please enter your invitation code."),
    }),
    onSubmit: login,
  })

  const registerRef = useFocusFirstError(formik)

  const isError = initialFetchError || formik.status === "serverError"
  const isMissing =
    (initialCode !== undefined || formik.status === "submitted") && !invitation

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
      <form onSubmit={formik.handleSubmit}>
        {(isError || isMissing) && (
          <Alert>
            {isError && "There was an error retrieving your invitation. "}
            {isMissing && "Hmm, we couldn't find that invitation code. "}
            Please email us at <ContactEmail />.
          </Alert>
        )}
        <LabelWrapper
          label="Invitation code"
          errorMessage={formik.touched.code ? formik.errors.code : undefined}
        >
          <Input
            {...formik.getFieldProps("code")}
            type="text"
            ref={registerRef}
            invalid={formik.touched.code && formik.errors.code !== undefined}
          />
          <Button disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </LabelWrapper>
      </form>
    )
  }
}
export default Authenticated
