export interface Firestore {
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
