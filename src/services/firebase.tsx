import { useEffect, useState } from "react"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
}

// Store global singleton instance of firebase to ensure
// there is always exactly one instantiation across the app.
type MaybeFirebase = firebase.app.App | null
let globalFirebaseApp: MaybeFirebase

export function useFirebaseApp() {
  const [firebaseApp, setFirebaseApp] = useState<MaybeFirebase>(null)
  useEffect(() => {
    if (!firebaseApp) {
      if (globalFirebaseApp) {
        setFirebaseApp(globalFirebaseApp)
      } else {
        console.log("loading firebase")
        const lazyApp = import("firebase/app")
        const lazyFirestore = import("firebase/firestore")
        Promise.all([lazyApp, lazyFirestore]).then(([app]) => {
          globalFirebaseApp = app.initializeApp(firebaseConfig)
          console.log("loaded firebase")
          setFirebaseApp(globalFirebaseApp)
        })
      }
    }
  }, [firebaseApp])
  return firebaseApp
}
