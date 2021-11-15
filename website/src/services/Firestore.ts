import { getApp, getApps, initializeApp, FirebaseApp } from "firebase/app"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  DocumentData,
  DocumentReference,
  Firestore as TFirestore,
  Timestamp,
} from "firebase/firestore"
import yn from "yn"

export interface QueryResult {
  data: DocumentData
}

export interface HasServerTimestamp {
  createdAt: Timestamp
}

export interface Firestore {
  /**
   * Add `data` to `collectionName`, optionally under the document
   * referenced by `docRef`.
   */
  addWithTimestamp: (
    collectionName: string,
    data: Record<string, any>,
    docRef?: (db: TFirestore) => DocumentReference
  ) => Promise<Record<string, any> & HasServerTimestamp>

  /**
   * Find a document with ID `id` in `collectionName`.
   */
  findById: (
    collectionName: string,
    id: string
  ) => Promise<QueryResult | undefined>
}

function makeFirestore(firebaseInstance: FirebaseApp): Firestore {
  return {
    addWithTimestamp: async (
      collectionName: string,
      data: Record<string, any>,
      docRef?: (db: TFirestore) => DocumentReference
    ) => {
      console.log(`Adding: `, data)
      const db = getFirestore(firebaseInstance)
      const coll = docRef
        ? collection(docRef(db), collectionName)
        : collection(db, collectionName)
      const docWithTimestamp = {
        createdAt: Timestamp.fromDate(new Date()),
        ...data,
      }
      return addDoc(coll, docWithTimestamp)
        .then((docRef) => {
          console.log(`Document added: ${docRef.id}`)
          return docWithTimestamp
        })
        .catch(observeAndRethrow)
    },
    findById: async (collectionName: string, id: string) => {
      const db = getFirestore(firebaseInstance)
      const docRef = doc(db, collectionName, id)
      return getDoc(docRef)
        .then((doc) =>
          doc.exists() ? { data: doc.data()!, ref: doc.ref } : undefined
        )
        .catch(observeAndRethrow)
    },
  }
}

function observeAndRethrow(error: Error): any {
  console.error("Error during execution: ", error)
  throw error
}

const firebaseConfig = yn(process.env.GATSBY_USE_PROD_FIREBASE)
  ? {
      apiKey: process.env.GATSBY_PROD_FIREBASE_API_KEY,
      authDomain: process.env.GATSBY_PROD_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.GATSBY_PROD_FIREBASE_PROJECT_ID,
    }
  : {
      apiKey: process.env.GATSBY_FIREBASE_API_KEY,
      authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
    }

export async function loadFirestore() {
  const apps = getApps()
  const firebaseInstance = apps.length
    ? getApp()
    : initializeApp(firebaseConfig)
  return makeFirestore(firebaseInstance)
}
