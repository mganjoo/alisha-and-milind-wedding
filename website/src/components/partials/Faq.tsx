import React from "react"
import { useUID } from "react-uid"

interface FaqProps {
  question: string
}

const Faq: React.FC<FaqProps> = ({ question, children }) => {
  const id = `faq-${useUID()}`
  return (
    <section className="c-article" aria-labelledby={id}>
      <h3 id={id}>{question}</h3>
      {children}
    </section>
  )
}

export default Faq