import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React from "react"
import { useUID } from "react-uid"

dayjs.extend(utc)

interface FaqProps {
  question: string
  updated?: string
}

const Faq: React.FC<FaqProps> = ({ question, children, updated }) => {
  const id = `faq-${useUID()}`
  return (
    <section className="c-article" aria-labelledby={id}>
      <h2 id={id}>{question}</h2>
      {updated && (
        <div className="mb-4">
          <span className="text-gray-800 font-sans text-lg font-semibold">
            Updated:{" "}
            {dayjs(updated)
              .utc()
              .format("MMMM D, YYYY")}
          </span>
        </div>
      )}
      {children}
    </section>
  )
}

export default Faq
