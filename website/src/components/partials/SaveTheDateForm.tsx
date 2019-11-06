import React from "react"
import Button from "../ui/Button"
import { useFormik, FormikHelpers } from "formik"
import { object, string } from "yup"
import LabelWrapper from "../form/LabelWrapper"
import Input from "../form/Input"
import Alert from "../form/Alert"
import { useFirestore } from "../../services/Firebase"
import ContactEmail from "./ContactEmail"
import { useFocusFirstError } from "../utils/UtilHooks"

interface SaveTheDateFormValues {
  name: string
  email: string
}

interface SaveTheDateFormProps {
  onSubmit: () => void
}

const errorStatus = "serverError"

const SaveTheDateForm: React.FC<SaveTheDateFormProps> = ({ onSubmit }) => {
  const firestore = useFirestore()

  function submitInfo(
    values: SaveTheDateFormValues,
    actions: FormikHelpers<SaveTheDateFormValues>
  ) {
    if (firestore) {
      return firestore
        .addWithTimestamp("contacts", values)
        .then(() => onSubmit())
        .catch(() => actions.setStatus(errorStatus))
        .finally(() => actions.setSubmitting(false))
    } else {
      return Promise.resolve()
    }
  }

  const initialValues: SaveTheDateFormValues = {
    name: "",
    email: "",
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: object({
      name: string().required("Name is required."),
      email: string()
        .email("A valid email is required.")
        .required("A valid email is required."),
    }),
    onSubmit: submitInfo,
  })

  const registerRef = useFocusFirstError(formik)

  return (
    <form
      className="flex flex-col items-center pb-8 lg:pb-16"
      onSubmit={formik.handleSubmit}
      noValidate
    >
      {formik.status === errorStatus && (
        <Alert className="my-3 mx-4 lg:mx-2">
          There was a problem submitting your info. Please email us at{" "}
          <ContactEmail />.
        </Alert>
      )}
      <div className="flex flex-wrap justify-between">
        <LabelWrapper
          label="Name"
          errorMessage={formik.touched.name ? formik.errors.name : undefined}
        >
          <Input
            {...formik.getFieldProps("name")}
            type="text"
            autoComplete="name"
            ref={registerRef}
            invalid={formik.touched.name && formik.errors.name !== undefined}
          />
        </LabelWrapper>
        <LabelWrapper
          label="Email address"
          errorMessage={formik.touched.email ? formik.errors.email : undefined}
        >
          <Input
            {...formik.getFieldProps("email")}
            type="email"
            autoComplete="email"
            ref={registerRef}
            invalid={formik.touched.email && formik.errors.email !== undefined}
          />
        </LabelWrapper>
      </div>
      <Button
        type="submit"
        className="mt-8 mb-2"
        disabled={!firestore || formik.isSubmitting}
      >
        {formik.isSubmitting ? "Submitting..." : "Submit info"}
      </Button>
    </form>
  )
}
export default SaveTheDateForm
