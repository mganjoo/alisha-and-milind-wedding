import React from "react"

interface FaqProps {
  question: string
}

const Faq: React.FC<FaqProps> = ({ question, children }) => {
  return (
    <div className="c-article">
      <h2>{question}</h2>
      <p>{children}</p>
    </div>
  )
}

export default Faq
