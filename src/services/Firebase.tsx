import { useEffect, useState } from "react"
import yn from "yn"

interface Firestore {
  addWithTimestamp: (
    collection: string,
    data: { [key: string]: any }
  ) => Promise<string>
}

function makeFirestore(
  firebaseInstance: firebase.app.App,
  makeTimestamp: (date: Date) => firebase.firestore.Timestamp
): Firestore {
  return {
    addWithTimestamp: (collection: string, data: { [key: string]: any }) => {
      return firebaseInstance
        .firestore()
        .collection(collection)
        .add({
          createdAt: makeTimestamp(new Date()),
          ...data,
        })
        .then(docRef => docRef.id)
    },
  }
}

type MaybeFirestore = Firestore | null

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
  const [firestore, setFirestore] = useState<MaybeFirestore>(null)
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
