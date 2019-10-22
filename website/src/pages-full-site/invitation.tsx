import React, { useEffect, useState } from "react"
import { Router, RouteComponentProps, navigate } from "@reach/router"
import { useFirestore } from "../services/Firebase"
import InvitationCard from "../components/partials/InvitationCard"
import { useIndexedValue } from "../services/IndexedDB"
import BaseLayout from "../components/layout/BaseLayout"
import Alert from "../components/form/Alert"

export default function InvitationPage() {
  return (
    <BaseLayout>
      <Router>
        <InvitationWrapper path="/invitation" />
        <InvitationWrapper path="/invitation/:code" />
      </Router>
    </BaseLayout>
  )
}

interface Invitation {
  code: string
  partyName: string
  guests: string[]
}

interface InvitationWrapperProps extends RouteComponentProps {
  code?: string
}

type InvitationStatus = "loading" | "error" | "loaded"

const InvitationWrapper: React.FC<InvitationWrapperProps> = ({ code }) => {
  const firestore = useFirestore()
  const [invitation, setInvitation] = useIndexedValue<Invitation>("invitation")
  const [status, setStatus] = useState<InvitationStatus>("loading")
  useEffect(() => {
    if (!invitation.loading) {
      if (invitation.value && invitation.value.code === code) {
        setStatus("loaded")
      } else if (firestore) {
        const newInvitationPromise = !code
          ? Promise.resolve(null)
          : firestore.findByKey("invitations", "code", code).then(records => {
              if (records.length === 1) {
                return records[0] as Invitation
              } else if (records.length > 1) {
                throw new Error("more than one invitation found with same code")
              } else {
                return null
              }
            })

        newInvitationPromise
          .then(newInvitation => {
            if (newInvitation) {
              setInvitation(newInvitation)
            } else {
              if (invitation.value) {
                // If we have a cached code already, navigate to it instead
                navigate(`/invitation/${invitation.value.code}`, {
                  replace: true,
                })
              } else {
                navigate("/", { replace: true })
              }
            }
          })
          .catch(err => {
            console.error("Error retrieving invitation:", err)
            setStatus("error")
          })
      }
    }
  }, [firestore, code, invitation, setInvitation])

  if (status === "error") {
    return <Alert>There was an error loading your invitation.</Alert>
  } else if (status === "loaded" && invitation.value) {
    return (
      <InvitationCard
        partyName={invitation.value.partyName}
        guests={invitation.value.guests}
      />
    )
  } else if (status === "loading") {
    return <p>Loading...</p>
  } else {
    return null
  }
}
