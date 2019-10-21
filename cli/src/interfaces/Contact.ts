import admin from "firebase-admin"

export default interface Contact {
  name: string
  email: string
  createdAt: admin.firestore.Timestamp
}
