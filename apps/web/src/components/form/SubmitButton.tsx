import { useFormContext } from "react-hook-form"
import Button, { type ButtonProps } from "../ui/Button"

interface SubmitButtonProps
  extends Omit<ButtonProps, "type" | "disabled" | "purpose"> {
  label: string
  loading?: boolean
  forceDisabled?: boolean
}

const SubmitButton = ({
  label,
  loading,
  forceDisabled,
  ...otherProps
}: SubmitButtonProps) => {
  const {
    formState: { isSubmitting },
  } = useFormContext()
  return (
    <Button
      {...otherProps}
      purpose="submit"
      disabled={forceDisabled || loading || isSubmitting}
    >
      {isSubmitting ? "Submitting..." : label}
    </Button>
  )
}
export default SubmitButton
