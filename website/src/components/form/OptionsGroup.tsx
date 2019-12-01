import React, { useMemo, useCallback } from "react"
import LabelWrapper from "./LabelWrapper"
import { useField, useFormikContext } from "formik"
import classnames from "classnames"
import { useRegisteredRef } from "react-register-nodes"
import ControlledLabelledOption from "./ControlledLabelledOption"
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

const OptionsGroup: React.FC<OptionsGroupProps> = ({
  name,
  type,
  options,
  label,
  showSelectAll,
  selectAllLabel,
  labelType = "text",
}) => {
  const [field, meta] = useField<any>(name)
  const ref = useRegisteredRef(name)
  const errorMessage = meta.touched ? meta.error : undefined
  const { setFieldValue } = useFormikContext<any>()
  const shouldShowSelectAll = !!showSelectAll && type === "checkbox"
  const allSelected = useMemo(
    () =>
      shouldShowSelectAll && options.every(o => field.value.includes(o.value)),
    [shouldShowSelectAll, options, field.value]
  )

  if (showSelectAll && !shouldShowSelectAll) {
    console.error(
      "shouldSelectAll is only supported on checkboxes with array name"
    )
  }

  const toggleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFieldValue(name, e.target.checked ? options.map(o => o.value) : []),
    [name, options, setFieldValue]
  )

  return (
    <LabelWrapper
      label={label}
      labelType={labelType}
      group
      errorMessage={errorMessage}
    >
      <div
        className={classnames("w-full px-2 pt-2", {
          "border rounded c-invalid-outline": !!errorMessage,
        })}
      >
        {shouldShowSelectAll && (
          <LabelledOption
            label={selectAllLabel || "Select all"}
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            labelClassName={classnames({ "font-semibold": allSelected })}
          />
        )}
        <div
          className={
            shouldShowSelectAll
              ? classnames(
                  "ml-2 pl-3 pt-1 border-l-2",
                  allSelected ? "border-orange-500" : "c-subtle-border"
                )
              : undefined
          }
        >
          {options.map((option, i) => (
            <ControlledLabelledOption
              key={`option-${option.value}`}
              name={name}
              type={type}
              label={option.label}
              value={option.value}
              ref={errorMessage && i === 0 ? ref : undefined}
            />
          ))}
        </div>
      </div>
    </LabelWrapper>
  )
}
export default OptionsGroup
