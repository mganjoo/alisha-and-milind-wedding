import { RouteComponentProps, navigate } from "@reach/router"
import { parse } from "query-string"
import React, { useEffect } from "react"
import BaseLayout from "../components/layout/BaseLayout"
import SEO from "../components/meta/SEO"
import Loading from "../components/ui/Loading"
import { InvitationNavigationState } from "../interfaces/InvitationNavigationState"
import { fetchAndSaveInvitationByCode } from "../services/Invitation"

interface InvitationPageQueryParams {
  c?: string
  t?: string
  immediate?: number
}

const LoadPage: React.FC<RouteComponentProps> = ({ location }) => {
  const pageArguments: InvitationPageQueryParams = location
    ? parse(location.search)
    : {}
  useEffect(() => {
    const loadedInvitationPromise = pageArguments.c
      ? fetchAndSaveInvitationByCode(pageArguments.c)
      : Promise.resolve(undefined)
    loadedInvitationPromise.finally(() => {
      navigate(pageArguments.t === "h" ? "/" : "/invitation", {
        replace: true,
        state:
          pageArguments.t === "h"
            ? undefined
            : ({
                animate: !pageArguments.immediate,
              } as InvitationNavigationState),
      })
    })
  }, [pageArguments])
  return (
    <BaseLayout>
      <SEO title="Welcome" image="/meta-main-hero.jpg" />
      <Loading />
    </BaseLayout>
  )
}
export default LoadPage
