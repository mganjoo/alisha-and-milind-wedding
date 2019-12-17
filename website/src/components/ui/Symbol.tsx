import React from "react"

type SymbolName = "check" | "question-mark" | "cross" | "chevron-down"

function getPath(symbol: SymbolName) {
  switch (symbol) {
    case "check":
      return (
        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z" />
      )
    case "question-mark":
      return (
        <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm2-13c0 .28-.21.8-.42 1L10 9.58c-.57.58-1 1.6-1 2.42v1h2v-1c0-.29.21-.8.42-1L13 9.42c.57-.58 1-1.6 1-2.42a4 4 0 1 0-8 0h2a2 2 0 1 1 4 0zm-3 8v2h2v-2H9z" />
      )
    case "cross":
      return (
        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z" />
      )
    case "chevron-down":
      return (
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      )
    default:
      return undefined
  }
}

interface SymbolProps {
  symbol: SymbolName
  className?: string
  inline?: boolean
}

const Symbol: React.FC<SymbolProps> = ({ symbol, className, inline }) => {
  const Elem = inline ? "span" : "div"
  return (
    <Elem className={className}>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        className="fill-current"
      >
        {getPath(symbol)}
      </svg>
    </Elem>
  )
}
export default Symbol
