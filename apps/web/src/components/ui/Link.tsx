import type React from "react"

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string
}

/** Drop-in for Gatsby's `<Link>`: a plain anchor (Astro sites are MPAs). */
const Link: React.FC<LinkProps> = ({ to, children, ...rest }) => (
  <a href={to} {...rest}>
    {children}
  </a>
)

export default Link
