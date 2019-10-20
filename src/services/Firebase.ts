import { useEffect, useState } from "react"
import yn from "yn"

interface Firestore {
  addWithTimestamp: (
    collection: string,
    data: { [key: string]: any }
  ) => Promise<string>

  findByKey: (
    collection: string,
    key: string,
    value: any
  ) => Promise<firebase.firestore.DocumentData[]>
}

function makeFirestore(
  firebaseInstance: firebase.app.App,
  makeTimestamp: (date: Date) => firebase.firestore.Timestamp
): Firestore {
  return {
    addWithTimestamp: async (
      collection: string,
      data: { [key: string]: any }
    ) => {
      console.log(`Adding: `, data)
      return firebaseInstance
        .firestore()
        .collection(collection)
        .add({
          createdAt: makeTimestamp(new Date()),
          ...data,
        })
        .then(docRef => {
          console.log(`Document added: ${docRef.id}`)
          return docRef.id
        })
        .catch(error => {
          console.error("Error during execution: ", error)
          throw error
        })
    },
    findByKey: async (collection: string, key: string, value: any) =>
      firebaseInstance
        .firestore()
        .collection(collection)
        .where(key, "==", value)
        .get()
        .then(snapshot => snapshot.docs.map(doc => doc.data())),
  }
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

export function useFirestore() {
  const [firestore, setFirestore] = useState<Firestore | null>(null)
  useEffect(() => {
    // Dynamic import of firebase modules, since some code depends on Window
    // (see https://kyleshevlin.com/firebase-and-gatsby-together-at-last/)
    const lazyFirebase = import("firebase/app")
    const lazyFirestore = import("firebase/firestore")
    Promise.all([lazyFirebase, lazyFirestore]).then(([firebase]) => {
      // Reuse already-initialized default firebase app if possible
      const firebaseInstance =
        firebase.apps && firebase.apps.length
          ? firebase.app()
          : firebase.initializeApp(firebaseConfig)
      const makeTimestamp = (date: Date) =>
        firebase.firestore.Timestamp.fromDate(date)
      setFirestore(makeFirestore(firebaseInstance, makeTimestamp))
    })
  }, []) // we load firebase only once, on component mount
  return firestore
}
