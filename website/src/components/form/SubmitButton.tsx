import React from "react"
import { useFormikContext } from "formik"
import Button from "../ui/Button"

interface SubmitButtonProps {
  label: string
  className?: string
  loading?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  className,
  loading,
}) => {
  const formik = useFormikContext()
  return (
    <Button
      type="submit"
      className={className}
      disabled={loading || formik.isSubmitting}
    >
      {formik.isSubmitting ? "Submitting..." : label}
    </Button>
  )
}
export default SubmitButton
