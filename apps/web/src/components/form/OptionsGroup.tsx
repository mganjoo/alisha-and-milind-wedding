import clsx from "clsx"
import { useController } from "react-hook-form"
import { useRegisteredRef } from "../../utils/RegisterNodes"
import InputGroup from "./InputGroup"
import LabelledOption from "./LabelledOption"
import { useMergedRef } from "./mergeRefs"
import { useFieldError } from "./useFieldError"

export interface Option {
  value: string
  label: string
}

interface OptionsGroupProps {
  name: string
  label: string
  labelType?: "text" | "id" | "aria"
  type: "radio" | "checkbox"
  options: Option[]
  /** Only supported for checkboxes (field value is a string array). */
  showSelectAll?: boolean
  selectAllLabel?: string
}

/**
 * A group of radio buttons (field value: the selected string) or checkboxes
 * (field value: array of selected strings).
 */
const OptionsGroup = ({
  name,
  type,
  options,
  label,
  showSelectAll,
  selectAllLabel,
  labelType = "text",
}: OptionsGroupProps) => {
  const { field } = useController({ name })
  const registeredRef = useRegisteredRef(name)
  const errorMessage = useFieldError(name)
  const firstRef = useMergedRef(
    field.ref,
    errorMessage ? registeredRef : undefined,
    name
  )
  const shouldShowSelectAll = !!showSelectAll && type === "checkbox"
  const selected: string[] = Array.isArray(field.value) ? field.value : []
  const allSelected =
    shouldShowSelectAll && options.every((o) => selected.includes(o.value))

  if (showSelectAll && !shouldShowSelectAll) {
    console.error(
      "shouldSelectAll is only supported on checkboxes with array name"
    )
  }

  const toggleOption = (value: string, checked: boolean) =>
    field.onChange(
      checked
        ? [...selected.filter((v) => v !== value), value]
        : selected.filter((v) => v !== value)
    )

  return (
    <InputGroup label={label} labelType={labelType} errorMessage={errorMessage}>
      {shouldShowSelectAll && (
        <LabelledOption
          label={selectAllLabel || "Select all"}
          type="checkbox"
          checked={allSelected}
          onChange={(e) =>
            field.onChange(e.target.checked ? options.map((o) => o.value) : [])
          }
          bold={allSelected}
        />
      )}
      <div
        className={
          shouldShowSelectAll
            ? clsx(
                "ml-2 pl-3 border-l-2",
                allSelected
                  ? "border-accent dark:border-accent-night"
                  : "border-subtle dark:border-subtle-night"
              )
            : undefined
        }
      >
        {options.map((option, i) => (
          <LabelledOption
            key={option.value}
            name={name}
            type={type}
            label={option.label}
            value={option.value}
            checked={
              type === "radio"
                ? field.value === option.value
                : selected.includes(option.value)
            }
            onChange={(e) =>
              type === "radio"
                ? field.onChange(option.value)
                : toggleOption(option.value, e.target.checked)
            }
            onBlur={field.onBlur}
            ref={i === 0 ? firstRef : undefined}
          />
        ))}
      </div>
    </InputGroup>
  )
}
export default OptionsGroup
