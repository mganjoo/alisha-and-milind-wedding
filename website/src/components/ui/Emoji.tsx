import React from "react"

interface EmojiProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string
  symbol: string
}

const Emoji: React.FC<EmojiProps> = ({ label, symbol, ...otherProps }) => (
  <span role="img" aria-label={label} aria-hidden={!label} {...otherProps}>
    {symbol}
  </span>
)

export default Emoji
