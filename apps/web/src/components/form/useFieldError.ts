import { get, useFormContext } from "react-hook-form"

/**
 * Error message for the field at `name` (dot-separated path), if any.
 * With `mode: "onTouched"` errors only exist once the field was blurred or the
 * form was submitted, so no extra "touched" check is needed.
 */
export function useFieldError(name: string): string | undefined {
  const {
    formState: { errors },
  } = useFormContext()
  const error = get(errors, name) as { message?: unknown } | undefined
  return typeof error?.message === "string" ? error.message : undefined
}
