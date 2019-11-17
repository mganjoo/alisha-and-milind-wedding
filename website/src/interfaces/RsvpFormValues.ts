import { mixed, object, InferType, ObjectSchema } from "yup"
import { filterNonEmptyKeys } from "../components/utils/Utils"

export type RsvpFormValues = InferType<typeof validationSchema>
export type GuestMap = Record<string, string>

export const validationSchema = object().shape({
  guests: object<GuestMap>().test({
    name: "has-some-guest",
    test: function test(value: GuestMap) {
      return (
        filterNonEmptyKeys(value).length > 0 ||
        this.createError({
          message:
            Object.keys(value).length > 1
              ? "At least one name is required."
              : "Name is required.",
        })
      )
    },
  }),
  attending: mixed<"yes" | "no" | "-">().oneOf(
    ["yes", "no"],
    "Please confirm your attendance."
  ),
  attendees: object<Record<string, string[]>>().when(
    "attending",
    (attending: string, schema: ObjectSchema) => {
      return attending === "yes"
        ? schema.test({
            name: "attending-at-least-one-event",
            test: (value: Record<string, string[]>) =>
              Object.values(value).some(v => v.length > 0),
            message:
              "Please confirm the specific events you will be attending.",
          })
        : schema
    }
  ),
})
