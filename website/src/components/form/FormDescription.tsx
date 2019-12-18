import React from "react"

const FormDescription: React.FC<Omit<
  React.HTMLAttributes<HTMLParagraphElement>,
  "className"
>> = ({ children, ...props }) => (
  <p {...props} className="font-serif mb-6 text-gray-800">
    {children}
  </p>
)

export default FormDescription
