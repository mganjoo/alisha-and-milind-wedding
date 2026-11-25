import { useEffect } from "react"
import { fetchAndSaveInvitationByCode } from "../../services/Invitation"
import { navigate } from "../../utils/navigation"
import Loading from "../ui/Loading"

interface CodeLoaderProps {
  redirectTo: string
  code?: string
}

const CodeLoader = ({ redirectTo, code }: CodeLoaderProps) => {
  useEffect(() => {
    const loadedInvitationPromise = code
      ? fetchAndSaveInvitationByCode(code)
      : Promise.resolve(undefined)
    loadedInvitationPromise.finally(() => {
      navigate(redirectTo, { replace: true })
    })
  }, [code, redirectTo])
  return <Loading />
}
export default CodeLoader
