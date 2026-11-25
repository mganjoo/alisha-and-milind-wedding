import { useController } from "react-hook-form"
import { useRegisteredRef } from "../../utils/RegisterNodes"
import InputGroup from "./InputGroup"
import LabelledOption from "./LabelledOption"
import { useMergedRef } from "./mergeRefs"
import { useFieldError } from "./useFieldError"

interface SingleCheckboxProps {
  name: string
  groupLabel: string
  groupLabelType?: "text" | "id" | "aria"
  optionLabel: string
  disabled?: boolean
}

/** A single boolean checkbox bound to the field at `name`. */
const SingleCheckbox = ({
  optionLabel,
  name,
  groupLabel,
  disabled,
  groupLabelType = "text",
}: SingleCheckboxProps) => {
  const { field } = useController({ name })
  const registeredRef = useRegisteredRef(name)
  const errorMessage = useFieldError(name)
  const ref = useMergedRef(
    field.ref,
    errorMessage ? registeredRef : undefined,
    name
  )
  return (
    <InputGroup
      label={groupLabel}
      labelType={groupLabelType}
      errorMessage={errorMessage}
    >
      <LabelledOption
        name={field.name}
        checked={!!field.value}
        onChange={(e) => field.onChange(e.target.checked)}
        onBlur={field.onBlur}
        label={optionLabel}
        type="checkbox"
        disabled={disabled}
        ref={ref}
      />
    </InputGroup>
  )
}
export default SingleCheckbox
