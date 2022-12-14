import React from "react"

interface ExternalLinkProps {
  href: string
  download?: string
  trackKey?: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

type TargetProps = {
  target?: string
  rel?: string
}

function makeClickTracker(
  label?: string
): React.MouseEventHandler<HTMLAnchorElement> {
  return () => {
    const w = window as any
    if (w.gtag) {
      w.gtag(`event`, `click`, {
        event_category: `outbound`,
        event_label: label,
      })
    }
  }
}

const newWindowProps = { target: "_blank", rel: "noopener noreferrer" }

const ExternalLink: React.FC<ExternalLinkProps> = React.forwardRef<
  HTMLAnchorElement,
  ExternalLinkProps
>(({ trackKey, children, onClick, ...otherProps }, ref) => {
  // Download links should open in the same window
  const targetProps: TargetProps = otherProps.download ? {} : newWindowProps
  const handleTrackClick = makeClickTracker(trackKey || otherProps.href)
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    onClick && onClick(e)
    if (!e.defaultPrevented && handleTrackClick) {
      handleTrackClick(e)
    }
  }
  const props = { ...otherProps, ...targetProps, onClick: handleClick }
  return (
    <a {...props} ref={ref}>
      {children}
    </a>
  )
})

export default ExternalLink
