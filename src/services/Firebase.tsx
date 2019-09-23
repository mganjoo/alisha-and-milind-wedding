import { useEffect, useState } from "react"

class Firestore {
  private firebaseInstance: firebase.app.App
  private makeTimestamp: (date: Date) => firebase.firestore.Timestamp

  constructor(
    firebaseInstance: firebase.app.App,
    makeTimestamp: (date: Date) => firebase.firestore.Timestamp
  ) {
    this.firebaseInstance = firebaseInstance
    this.makeTimestamp = makeTimestamp
  }

  addWithTimestamp = (collection: string, data: { [key: string]: any }) => {
    return this.firebaseInstance
      .firestore()
      .collection(collection)
      .add({
        createdAt: this.makeTimestamp(new Date()),
        ...data,
      })
  }
}

type MaybeFirestore = Firestore | null

const firebaseConfig = {
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
      setFirestore(new Firestore(firebaseInstance, makeTimestamp))
    })
  }, []) // we load firebase only once, on component mount
  return firestore
}
