import React, { useContext, useState } from "react"
import { InvitationContext } from "./Authenticated"
import RsvpForm from "./RsvpForm"
import RsvpInfo from "./RsvpInfo"

const RsvpSection: React.FC = () => {
  const { invitation } = useContext(InvitationContext)
  const [editingForm, setEditingForm] = useState(false)

  return editingForm || !invitation.latestRsvp ? (
    <RsvpForm onDone={() => setEditingForm(false)} />
  ) : (
    <RsvpInfo handleEditRsvp={() => setEditingForm(true)} />
  )
}

export default RsvpSection
