import React from "react"
import NoImageLayout from "../components/layout/NoImageLayout"
import SEO from "../components/meta/SEO"
import Faq from "../components/partials/Faq"
import PageHeading from "../components/ui/PageHeading"

const FaqPage = () => (
  <NoImageLayout>
    <SEO title="FAQ" />
    <PageHeading>FAQ</PageHeading>
    <Faq question="What is the meaning of life?">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias error
      saepe officia, autem accusamus et ad iure deleniti. Expedita ab vel quod
      nemo delectus molestiae vitae animi voluptatum quisquam praesentium!
    </Faq>
    <Faq question="What is the answer to this question?">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias error
      saepe officia, autem accusamus et ad iure deleniti. Expedita ab vel quod
      nemo delectus molestiae vitae animi voluptatum quisquam praesentium!
    </Faq>
  </NoImageLayout>
)
export default FaqPage
