import { navigate } from "@reach/router"
import React, { useEffect } from "react"
import BaseLayout from "../components/layout/BaseLayout"
import Loading from "../components/ui/Loading"
import { clearInvitationData } from "../services/Storage"

const ClearPage: React.FC = () => {
  useEffect(() => {
    clearInvitationData().then(() =>
      navigate("/", {
        replace: true,
      })
    )
  }, [])
  return (
    <BaseLayout>
      <Loading />
    </BaseLayout>
  )
}
export default ClearPage
