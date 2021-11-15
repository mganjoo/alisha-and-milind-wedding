import { getApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

interface Contact {
  id: string
  name: string
  email: string
  createdAt: FirebaseFirestore.Timestamp
}

export async function getContacts(after?: string) {
  const contactsRef = getFirestore(getApp()).collection("contacts")
  const cursor = await (after
    ? contactsRef.doc(after).get()
    : Promise.resolve(undefined))
  if (cursor && !cursor.exists) {
    throw new Error("document ID for cursor is invalid")
  }
  const query = cursor
    ? contactsRef.orderBy("createdAt").startAfter(cursor)
    : contactsRef
  const snapshot = await query.get()
  const contacts = snapshot.docs.map(
    (doc) => ({ id: doc.ref.id, ...doc.data() } as Contact)
  )
  return contacts.map(({ createdAt, ...other }) => ({
    ...other,
    created: dayjs(createdAt.toDate()).utc().format("YYYY-MM-DD HH:mm:ss"),
  }))
}
