import { useContext } from "react"
import { WeddingMetadataContext } from "../../utils/WeddingMetadataContext"

const ContactEmail = () => {
  const data = useContext(WeddingMetadataContext)
  return data ? (
    <a href={`mailto:${data.contactEmail}`}>{data.contactEmail}</a>
  ) : null
}
export default ContactEmail
