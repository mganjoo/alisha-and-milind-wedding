import React, { useContext, useState, useEffect, useCallback } from "react"
import Alert from "../../ui/Alert"
import Loading from "../../ui/Loading"
import { InvitationContext } from "../Authenticated"
import RsvpForm from "./RsvpForm"
import RsvpInfo from "./RsvpInfo"

type RefetchStatus = "fetching" | "fetched" | "error"

const ReeditableRsvpForm: React.FC = () => {
  const { invitation, reloadSaved } = useContext(InvitationContext)
  const [editingForm, setEditingForm] = useState(false)
  const [refetchStatus, setRefetchStatus] = useState<RefetchStatus>("fetching")
  const refetch = useCallback(
    () =>
      reloadSaved({ olderThanSecs: 90 })
        .then(() => {
          setRefetchStatus("fetched")
        })
        .catch(() => setRefetchStatus("error")),
    [reloadSaved]
  )
  const retry = useCallback(() => {
    setRefetchStatus("fetching")
    refetch()
  }, [refetch])

  useEffect(() => {
    refetch()
  }, [refetch])

  if (refetchStatus === "fetching") {
    return <Loading />
  } else if (
    editingForm ||
    (refetchStatus === "fetched" && !invitation.latestRsvp)
  ) {
    return <RsvpForm onDone={() => setEditingForm(false)} />
  } else if (refetchStatus === "error" && !invitation.latestRsvp) {
    return (
      <Alert action={{ label: "Retry", onClick: retry }}>
        Looks like your device is offline. The RSVP form is temporarily
        disabled.
      </Alert>
    )
  } else {
    return (
      <>
        {refetchStatus === "error" && (
          <Alert action={{ label: "Retry", onClick: retry }}>
            Looks like your device is offline. The information below might be
            out of date, and editing the RSVP is temporarily disabled.
          </Alert>
        )}
        <RsvpInfo
          handleEditRsvp={
            refetchStatus === "error" ? undefined : () => setEditingForm(true)
          }
        />
      </>
    )
  }
}

export default ReeditableRsvpForm
