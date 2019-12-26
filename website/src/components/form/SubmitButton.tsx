import { useFormikContext } from "formik"
import React from "react"
import Button, { ButtonProps } from "../ui/Button"

interface SubmitButtonProps
  extends Omit<ButtonProps, "type" | "disabled" | "purpose"> {
  label: string
  loading?: boolean
  forceDisabled?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  loading,
  forceDisabled,
  ...otherProps
}) => {
  const formik = useFormikContext()
  return (
    <Button
      {...otherProps}
      purpose="submit"
      disabled={forceDisabled || loading || formik.isSubmitting}
    >
      {formik.isSubmitting ? "Submitting..." : label}
    </Button>
  )
}
export default SubmitButton
