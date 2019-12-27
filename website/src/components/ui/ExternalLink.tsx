import React from "react"

interface ExternalLinkProps {
  href: string
  track?: boolean
  download?: string
  className?: string
}

function clickTracker(url: string): React.MouseEventHandler<HTMLAnchorElement> {
  return () => {
    const w = window as any
    if (w.gtag) {
      w.gtag(`event`, `click`, {
        event_category: `outbound`,
        event_label: url,
        transport_type: ``,
        event_callback: () => {},
      })
    }
    return false
  }
}

const newWindowProps = { target: "_blank", rel: "noopener noreferrer" }

const ExternalLink: React.FC<ExternalLinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ExternalLinkProps
>(({ track, children, ...otherProps }, ref) => {
  // Download links should open in the same window
  const targetProps = otherProps.download ? {} : newWindowProps
  const clickHandlerProps =
    track && !otherProps.download
      ? { onClick: clickTracker(otherProps.href) }
      : {}
  const props = Object.assign({ ...otherProps }, targetProps, clickHandlerProps)
  return (
    <a {...props} ref={ref}>
      {children}
    </a>
  )
})

export default ExternalLink
