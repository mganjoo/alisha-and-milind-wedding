import React from "react"
import FullPageInvitation from "../components/partials/FullPageInvitation"
import BaseLayout from "../components/layout/BaseLayout"

const DemoPage: React.FC = () => (
  <BaseLayout>
    <FullPageInvitation showDemoBar />
  </BaseLayout>
)
export default DemoPage
