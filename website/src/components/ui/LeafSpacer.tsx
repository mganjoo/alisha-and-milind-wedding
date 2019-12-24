import classnames from "classnames"
import React from "react"

interface LeafSpacerProps {
  wide?: boolean
}

const LeafSpacer: React.FC<LeafSpacerProps> = ({ wide }) => (
  <div
    aria-hidden
    className={classnames("flex justify-center", wide ? "my-6" : "my-2")}
  >
    <svg
      className="text-gray-600 stroke-current"
      width="70"
      height="28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M54.843 10.9c-3.615 2.051-6.843 3.81-9.798 5.273m9.798-5.272C56.666 1 68.99 3.516 68.99 3.516s.437 4.194-4.456 5.452c-4.894 1.258-4.894-.42-9.69 1.933zm0 0s3.522-4.869 6.922-4.45M1 6.452c5.78 5.347 6.834 5.94 14.025 9.355m30.02.367c.995 9.569 13.994 3.522 16.295 2.02-4.258-2.622-9.556-.245-16.295-2.02zm0 0c2.903-5.16 2.886-11.09 0-15.173-2.888 4.439-2.91 10.371 0 15.173zm0 0c-5.86 1.578-10.748 2.29-15.155 2.16m0 0c.238-.27 10.2 2.796 5.525 8.667-1.7-1.677-7.65-4.613-5.525-8.666zm0 0c4.138-3.668 4.452-8.55 1.7-11.881-2.183 4.265-2.595 6.857-1.7 11.882zm0 0c-3.353-.097-10.249-1.333-14.865-2.527m0 0c2.574 3.195 4.386 3.486 2.125 8.678-2.91-4.533-4.308-4.42-2.125-8.678zm0 0c6.161-2.433 5.466-6.73 6.375-6.838 2.586 5.077.425 6.838-6.375 6.838z" />
    </svg>
  </div>
)
export default LeafSpacer
