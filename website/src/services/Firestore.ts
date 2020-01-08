import yn from "yn"

export interface QueryResult {
  data: firebase.firestore.DocumentData
}

export interface HasServerTimestamp {
  createdAt: firebase.firestore.Timestamp
}

export interface Firestore {
  /**
   * Add `data` to `collection`, optionally under the document
   * referenced by `docRef`.
   */
  addWithTimestamp: (
    collection: string,
    data: Record<string, any>,
    docRef?: (
      db: firebase.firestore.Firestore
    ) => firebase.firestore.DocumentReference
  ) => Promise<Record<string, any> & HasServerTimestamp>

  /**
   * Find a document with ID `id` in `collection`.
   */
  findById: (collection: string, id: string) => Promise<QueryResult | undefined>
}

function makeFirestore(
  firebaseInstance: firebase.app.App,
  makeTimestamp: (date: Date) => firebase.firestore.Timestamp
): Firestore {
  return {
    addWithTimestamp: async (
      collection: string,
      data: Record<string, any>,
      docRef?: (
        db: firebase.firestore.Firestore
      ) => firebase.firestore.DocumentReference
    ) => {
      console.log(`Adding: `, data)
      const db = firebaseInstance.firestore()
      const base = docRef ? docRef(db) : db
      const docWithTimestamp = {
        createdAt: makeTimestamp(new Date()),
        ...data,
      }
      return base
        .collection(collection)
        .add(docWithTimestamp)
        .then(docRef => {
          console.log(`Document added: ${docRef.id}`)
          return docWithTimestamp
        })
        .catch(observeAndRethrow)
    },
    findById: async (collection: string, id: string) =>
      firebaseInstance
        .firestore()
        .collection(collection)
        .doc(id)
        .get()
        .then(doc =>
          doc.exists ? { data: doc.data()!, ref: doc.ref } : undefined
        )
        .catch(observeAndRethrow),
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
  // Dynamic import of firebase modules, since some code depends on Window
  // (see https://kyleshevlin.com/firebase-and-gatsby-together-at-last/)
  const loadedFirebase = await import("firebase/app")
  await import("firebase/firestore")
  // Reuse already-initialized default firebase app if possible
  const firebaseInstance =
    loadedFirebase.apps && loadedFirebase.apps.length
      ? loadedFirebase.app()
      : loadedFirebase.initializeApp(firebaseConfig)
  const makeTimestamp = (date: Date) =>
    loadedFirebase.firestore.Timestamp.fromDate(date)
  return makeFirestore(firebaseInstance, makeTimestamp)
}
