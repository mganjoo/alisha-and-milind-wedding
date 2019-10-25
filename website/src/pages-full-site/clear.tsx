import React, { useEffect } from "react"
import { navigate } from "@reach/router"
import Loading from "../components/ui/Loading"
import BaseLayout from "../components/layout/BaseLayout"
import { clearSavedInvitation } from "../services/Invitation"

const ClearPage: React.FC = () => {
  useEffect(() => {
    clearSavedInvitation().then(() =>
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
