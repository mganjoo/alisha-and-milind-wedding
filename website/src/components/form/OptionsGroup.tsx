import classnames from "classnames"
import { useField } from "formik"
import React, { useMemo, useCallback } from "react"
import { useRegisteredRef } from "../../utils/RegisterNodes"
import InputGroup from "./InputGroup"
import LabelledOption from "./LabelledOption"

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
  showSelectAll?: boolean
  selectAllLabel?: string
}
interface ControlledLabelledOptionProps {
  name: string
  type: "radio" | "checkbox"
  label: string
  value: string
}

const ControlledLabelledOption = React.forwardRef<
  HTMLInputElement,
  ControlledLabelledOptionProps
>(({ label, name, type, value }, ref) => {
  const [field] = useField<any>({ name, type, value })
  return <LabelledOption {...field} label={label} type={type} ref={ref} />
})

const OptionsGroup: React.FC<OptionsGroupProps> = ({
  name,
  type,
  options,
  label,
  showSelectAll,
  selectAllLabel,
  labelType = "text",
}) => {
  const [field, meta, helpers] = useField<any>(name)
  const ref = useRegisteredRef(name)
  const errorMessage = meta.touched ? meta.error : undefined
  const shouldShowSelectAll = !!showSelectAll && type === "checkbox"
  const allSelected = useMemo(
    () =>
      shouldShowSelectAll &&
      options.every((o) => field.value && field.value.includes(o.value)),
    [shouldShowSelectAll, options, field.value]
  )

  if (showSelectAll && !shouldShowSelectAll) {
    console.error(
      "shouldSelectAll is only supported on checkboxes with array name"
    )
  }

  const toggleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      helpers.setValue(e.target.checked ? options.map((o) => o.value) : []),
    [options, helpers]
  )

  return (
    <InputGroup label={label} labelType={labelType} errorMessage={errorMessage}>
      {shouldShowSelectAll && (
        <LabelledOption
          label={selectAllLabel || "Select all"}
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
          bold={allSelected}
        />
      )}
      <div
        className={
          shouldShowSelectAll
            ? classnames(
                "ml-2 pl-3 border-l-2",
                allSelected
                  ? "border-accent dark:border-accent-night"
                  : "border-subtle dark:border-subtle-night"
              )
            : undefined
        }
      >
        {options.map((option, i) => (
          <ControlledLabelledOption
            key={option.value}
            name={name}
            type={type}
            label={option.label}
            value={option.value}
            ref={errorMessage && i === 0 ? ref : undefined}
          />
        ))}
      </div>
    </InputGroup>
  )
}
export default OptionsGroup
