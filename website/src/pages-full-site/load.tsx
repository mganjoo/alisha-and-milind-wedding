import React, { useEffect } from "react"
import { RouteComponentProps, navigate } from "@reach/router"
import queryString from "query-string"
import Loading from "../components/ui/Loading"
import BaseLayout from "../components/layout/BaseLayout"

interface InvitationPageQueryParams {
  c?: string
}

const LoadPage: React.FC<RouteComponentProps> = ({ location }) => {
  const pageArguments: InvitationPageQueryParams = location
    ? queryString.parse(location.search)
    : {}
  useEffect(() => {
    navigate("/invitation", {
      replace: true,
      state: { code: pageArguments.c },
    })
  }, [pageArguments])
  return (
    <BaseLayout>
      <Loading />
    </BaseLayout>
  )
}
export default LoadPage
