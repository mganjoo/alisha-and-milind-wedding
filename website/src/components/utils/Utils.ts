import { FormikHelpers } from "formik"

export function createSubmitFunction<Val>(
  submit: (values: Val) => Promise<void>
) {
  return (values: Val, actions: FormikHelpers<Val>) => {
    return submit(values).finally(() => actions.setSubmitting(false))
  }
}
