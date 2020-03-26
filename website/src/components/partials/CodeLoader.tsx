import { RouteComponentProps, navigate } from "@reach/router"
import React, { useEffect } from "react"
import { fetchAndSaveInvitationByCode } from "../../services/Invitation"
import Loading from "../ui/Loading"

interface CodeLoaderProps extends RouteComponentProps {
  redirectTo: string
  code?: string
}

const CodeLoader: React.FC<CodeLoaderProps> = ({ redirectTo, code }) => {
  useEffect(() => {
    const loadedInvitationPromise = code
      ? fetchAndSaveInvitationByCode(code)
      : Promise.resolve(undefined)
    loadedInvitationPromise.finally(() => {
      navigate(redirectTo, {
        replace: true,
      })
    })
  }, [code, redirectTo])
  return <Loading />
}
export default CodeLoader
