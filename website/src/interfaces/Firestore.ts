export interface QueryResult {
  ref: firebase.firestore.DocumentReference
  data: firebase.firestore.DocumentData
}

export interface Firestore {
  addWithTimestamp: (
    collection: string,
    data: Record<string, any>,
    docRef?: firebase.firestore.DocumentReference
  ) => Promise<string>

  findByKey: (
    collection: string,
    key: string,
    value: any
  ) => Promise<QueryResult[]>
}
