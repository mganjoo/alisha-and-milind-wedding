import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import type React from "react"
import { useId } from "react"

dayjs.extend(utc)

interface FaqProps extends React.PropsWithChildren {
  question: string
  updated?: string
}

const Faq: React.FC<FaqProps> = ({ question, children, updated }) => {
  const id = `faq-${useId()}`
  return (
    <section className="c-article" aria-labelledby={id}>
      <h2 id={id}>{question}</h2>
      {updated && (
        <div className="mt-2 mb-4 px-3 py-1 rounded-full bg-amber-200 text-stone-900 inline-block font-sans text-sm font-medium dark:bg-stone-600 dark:text-stone-100 print:border print:border-subtle print:bg-transparent">
          Updated: {dayjs(updated).utc().format("MMMM D, YYYY")}
        </div>
      )}
      {children}
    </section>
  )
}

export default Faq
