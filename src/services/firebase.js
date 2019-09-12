import { useEffect, useState } from "react"

const firebaseConfig = {
  apiKey: process.env.GATSBY_FIREBASE_API_KEY,
  authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
}

export function useFirebase() {
  const [firebase, setFirebase] = useState(null)
  useEffect(() => {
    if (!firebase) {
      console.log("loading firebase")
      const lazyApp = import("firebase/app")
      const lazyFirestore = import("firebase/firestore")
      Promise.all([lazyApp, lazyFirestore]).then(([app]) => {
        app.initializeApp(firebaseConfig)
        console.log("loaded firebase")
        setFirebase(app)
      })
    }
  })
  return firebase
}
