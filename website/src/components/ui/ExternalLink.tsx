import React from "react"

type ExternalLinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "download" | "className" | "onClick"
> & {
  href: string
  track?: boolean
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
    return true
  }
}

const newWindowProps = { target: "_blank", rel: "noopener noreferrer" }

const ExternalLink: React.FC<ExternalLinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ExternalLinkProps
>(({ track, children, onClick, ...otherProps }, ref) => {
  // Download links should open in the same window
  const targetProps = otherProps.download ? {} : newWindowProps
  const clickHandlerProps =
    track && !otherProps.download
      ? {
          onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) =>
            (!onClick || onClick(e)) && clickTracker(otherProps.href),
        }
      : {}
  const props = Object.assign({ ...otherProps }, targetProps, clickHandlerProps)
  return (
    <a {...props} ref={ref}>
      {children}
    </a>
  )
})

export default ExternalLink
