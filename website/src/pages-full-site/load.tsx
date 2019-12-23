import { RouteComponentProps, navigate } from "@reach/router"
import { parse } from "query-string"
import React, { useEffect } from "react"
import BaseLayout from "../components/layout/BaseLayout"
import Loading from "../components/ui/Loading"

interface InvitationPageQueryParams {
  c?: string
  immediate?: number
}

const LoadPage: React.FC<RouteComponentProps> = ({ location }) => {
  const pageArguments: InvitationPageQueryParams = location
    ? parse(location.search)
    : {}
  useEffect(() => {
    navigate("/invitation", {
      replace: true,
      state: {
        code: pageArguments.c,
        immediate: pageArguments.immediate && pageArguments.immediate > 0,
      },
    })
  }, [pageArguments])
  return (
    <BaseLayout>
      <Loading />
    </BaseLayout>
  )
}
export default LoadPage
