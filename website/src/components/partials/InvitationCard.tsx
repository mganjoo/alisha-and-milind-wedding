import React from "react"

interface InvitationCardProps {
  partyName: string
  guests: string[]
}

export default function InvitationCard({
  partyName,
  guests,
}: InvitationCardProps) {
  return (
    <div>
      <p>To: {partyName}</p>
      <ul>
        {guests.map(guest => (
          <li key={guest}>{guest}</li>
        ))}
      </ul>
    </div>
  )
}
