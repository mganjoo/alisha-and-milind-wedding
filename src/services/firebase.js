import { useEffect, useState } from "react"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
}

// Store global singleton instance of firebase to ensure
// there is always exactly one instantiation across the app.
let firebaseInstance

export function useFirebase() {
  const [firebase, setFirebase] = useState(null)
  useEffect(() => {
    if (!firebase) {
      if (firebaseInstance) {
        setFirebase(firebaseInstance)
      } else {
        console.log("loading firebase")
        const lazyApp = import("firebase/app")
        const lazyFirestore = import("firebase/firestore")
        Promise.all([lazyApp, lazyFirestore]).then(([app]) => {
          app.initializeApp(firebaseConfig)
          firebaseInstance = app
          console.log("loaded firebase")
          setFirebase(firebaseInstance)
        })
      }
    }
  }, [firebase])
  return firebase
}
