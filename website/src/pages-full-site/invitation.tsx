import React, { useEffect, useState } from "react"
import { Router, RouteComponentProps, navigate } from "@reach/router"
import { useFirestore } from "../services/Firebase"

export default function InvitationPage() {
  return (
    <Router>
      <Invitation path="/invitation/:code" />
    </Router>
  )
}

interface _Invitation {
  code: string
  partyName: string
  guests: string[]
}

interface InvitationProps extends RouteComponentProps {
  code?: string
}

function navigateToCodePage() {
  // TODO: redirect to code page
  navigate("/")
}

const Invitation: React.FC<InvitationProps> = ({ code }) => {
  const firestore = useFirestore()
  const [invitation, setInvitation] = useState<_Invitation>()
  useEffect(() => {
    async function fetchInvitation() {
      if (!code) {
        navigateToCodePage()
      } else if (firestore) {
        const records = await firestore.findByKey("invitations", "code", code)
        // TODO: handle error
        if (records.length === 1) {
          // TODO: validate fields of invitation too
          setInvitation(records[0] as _Invitation)
        } else if (records.length > 1) {
          // TODO: this is an error
        } else {
          navigateToCodePage()
        }
      }
    }
    fetchInvitation()
  }, [firestore, code])

  return invitation ? (
    <div>
      <p>To: {invitation.partyName}</p>
      <ul>
        {invitation.guests.map(guest => (
          <li key={guest}>{guest}</li>
        ))}
      </ul>
    </div>
  ) : (
    <p>Loading...</p>
  )
}
