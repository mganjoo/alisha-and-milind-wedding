import { zodResolver } from "@hookform/resolvers/zod"
import {
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
  useForm,
} from "react-hook-form"
import type { z } from "zod"

/**
 * `useForm` preconfigured to behave like the old Formik forms:
 * - validation runs with the zod `schema`;
 * - errors appear after a field is blurred or after a submit attempt, and are
 *   then kept up to date on every change (`onTouched`);
 * - focusing the first invalid field is left to `FirstErrorFocuser`.
 */
export function useZodForm<
  S extends z.ZodType<FieldValues, FieldValues>,
>(options: {
  schema: S
  defaultValues: DefaultValues<z.input<S>>
}): UseFormReturn<z.input<S>, unknown, z.output<S>> {
  return useForm<z.input<S>, unknown, z.output<S>>({
    // The resolver's generics are looser than the form's; the schema is the
    // single source of truth for both.
    // biome-ignore lint/suspicious/noExplicitAny: zodResolver's overloaded generics can't be expressed for a generic schema
    resolver: zodResolver(options.schema as any) as any,
    defaultValues: options.defaultValues,
    mode: "onTouched",
    shouldFocusError: false,
  })
}
