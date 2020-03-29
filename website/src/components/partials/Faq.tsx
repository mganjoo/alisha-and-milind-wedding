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
        <div className="mt-2 mb-4 px-3 py-1 rounded-full bg-orange-200 text-gray-800 inline-block font-sans text-sm font-medium print:border print:border-gray-400 print:bg-transparent">
          Updated:{" "}
          {dayjs(updated)
            .utc()
            .format("MMMM D, YYYY")}
        </div>
      )}
      {children}
    </section>
  )
}

export default Faq
