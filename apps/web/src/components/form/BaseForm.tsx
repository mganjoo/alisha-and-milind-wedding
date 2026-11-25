import type { PropsWithChildren } from "react"
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form"
import { NodeManager } from "../../utils/RegisterNodes"
import FirstErrorFocuser from "./FirstErrorFocuser"

interface BaseFormProps<TIn extends FieldValues, TOut extends FieldValues> {
  /** Form instance from `useZodForm` / `useForm`. */
  form: UseFormReturn<TIn, unknown, TOut>
  onSubmit: SubmitHandler<TOut>
}

/**
 * Provides the form context to all form components below it and renders a
 * `<form noValidate>`; errors come from the zod schema, not the browser.
 */
function BaseForm<TIn extends FieldValues, TOut extends FieldValues>({
  form,
  onSubmit,
  children,
}: PropsWithChildren<BaseFormProps<TIn, TOut>>) {
  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <NodeManager>
          <FirstErrorFocuser>{children}</FirstErrorFocuser>
        </NodeManager>
      </form>
    </FormProvider>
  )
}

export default BaseForm
