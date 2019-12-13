import React from "react"
import { useFormikContext } from "formik"
import Button, { ButtonProps } from "../ui/Button"

interface SubmitButtonProps
  extends Omit<ButtonProps, "type" | "disabled" | "purpose"> {
  label: string
  loading?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  loading,
  ...otherProps
}) => {
  const formik = useFormikContext()
  return (
    <Button
      {...otherProps}
      purpose="submit"
      disabled={loading || formik.isSubmitting}
    >
      {formik.isSubmitting ? "Submitting..." : label}
    </Button>
  )
}
export default SubmitButton
