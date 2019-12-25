import React from "react"

interface FaqProps {
  question: string
}

const Faq: React.FC<FaqProps> = ({ question, children }) => {
  return (
    <div className="c-article">
      <h3>{question}</h3>
      {children}
    </div>
  )
}

export default Faq
