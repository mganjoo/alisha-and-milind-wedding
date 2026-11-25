import type React from "react"

interface ExternalLinkProps
  extends React.PropsWithChildren<
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">
  > {
  href: string
  ref?: React.Ref<HTMLAnchorElement>
}

const newWindowProps = { target: "_blank", rel: "noopener noreferrer" }

/**
 * Link to another site; opens in a new window (download links open in the
 * same window). The 2022 version also sent a Google Analytics event, which
 * is retired.
 */
const ExternalLink: React.FC<ExternalLinkProps> = ({
  children,
  ref,
  ...props
}) => (
  <a {...props} {...(props.download ? {} : newWindowProps)} ref={ref}>
    {children}
  </a>
)

export default ExternalLink
