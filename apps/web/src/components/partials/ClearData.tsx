import { useEffect } from "react"
import { clearInvitationData } from "../../services/Storage"
import { navigate } from "../../utils/navigation"
import Loading from "../ui/Loading"

/** Clears the saved invitation, then returns to the home page. */
const ClearData = () => {
  useEffect(() => {
    clearInvitationData().then(() => navigate("/", { replace: true }))
  }, [])
  return <Loading />
}
export default ClearData
