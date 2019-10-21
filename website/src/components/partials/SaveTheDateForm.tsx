import React from "react"
import Button from "../ui/Button"
import {
  useForm,
  SimpleValidator,
  FieldConfig,
  SubmissionMap,
} from "../form/Form"
import { ValidEmail, NonEmpty } from "../form/ValidatorPredicate"
import LabelWrapper from "../form/LabelWrapper"
import Input from "../form/Input"
import Alert from "../form/Alert"
import { useFirestore } from "../../services/Firebase"

const fields: FieldConfig[] = [
  { name: "name", validator: SimpleValidator(NonEmpty, "Name is required.") },
  {
    name: "email",
    validator: SimpleValidator(ValidEmail, "A valid email is required."),
  },
]

interface SaveTheDateFormProps {
  onSubmit: () => void
}

const SaveTheDateForm: React.FC<SaveTheDateFormProps> = ({ onSubmit }) => {
  const firestore = useFirestore()

  async function submitInfo(submission: SubmissionMap) {
    if (firestore !== null) {
      return firestore
        .addWithTimestamp("contacts", submission)
        .then(() => onSubmit())
    } else {
      return Promise.resolve()
    }
  }

  const {
    values,
    errors,
    formStatus,
    handleChange,
    handleBlur,
    handleSubmit,
    registerRef,
  } = useForm(fields, submitInfo)

  const renderInput = (
    name: string,
    autoComplete: string,
    type: "text" | "email"
  ) => (
    <Input
      name={name}
      type={type}
      value={values[name]}
      autoComplete={autoComplete}
      onChange={handleChange}
      onBlur={handleBlur}
      ref={registerRef}
      invalid={errors[name] !== null}
    />
  )

  return (
    <form
      className="flex flex-col items-center pb-8 lg:pb-16"
      onSubmit={handleSubmit}
      noValidate
    >
      {formStatus === "error" && (
        <Alert className="my-3 mx-4 lg:mx-2">
          There was a problem submitting your info. Please email us at{" "}
          <a href="mailto:alisha.and.milind@gmail.com">
            alisha.and.milind@gmail.com
          </a>
          .
        </Alert>
      )}
      <div className="flex flex-wrap justify-between">
        <LabelWrapper label="Name" errorMessage={errors.name}>
          {renderInput("name", "name", "text")}
        </LabelWrapper>
        <LabelWrapper label="Email address" errorMessage={errors.email}>
          {renderInput("email", "email", "email")}
        </LabelWrapper>
      </div>
      <Button
        type="submit"
        className="mt-8 mb-2"
        disabled={!firestore || formStatus === "submitting"}
      >
        {formStatus === "submitting" ? "Submitting..." : "Submit info"}
      </Button>
    </form>
  )
}
export default SaveTheDateForm
