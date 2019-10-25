import React, { useContext } from "react"
import { InvitationContext } from "./Authenticated"

export default function InvitationCard() {
  const invitation = useContext(InvitationContext)
  return (
    <div>
      <p>To: {invitation.partyName}</p>
      <ul>
        {invitation.guests.map(guest => (
          <li key={guest}>{guest}</li>
        ))}
      </ul>
    </div>
  )
}
