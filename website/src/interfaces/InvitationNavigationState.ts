export interface InvitationNavigationState {
  fromRsvp: boolean
}

export function isInvitationNavigationState(
  navigationState: unknown
): navigationState is InvitationNavigationState {
  return (
    typeof navigationState === "object" &&
    navigationState !== null &&
    (navigationState as InvitationNavigationState).fromRsvp !== undefined
  )
}
