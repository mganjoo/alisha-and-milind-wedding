import React, { useContext } from "react"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"

const ContactEmail: React.FC = () => {
  const data = useContext(WeddingMetadataContext)
  return <a href={`mailto:${data.contactEmail}`}>{data.contactEmail}</a>
}
export default ContactEmail
