import {
  loadFirestore,
  Firestore,
  HasServerTimestamp,
  QueryResult,
} from "../services/Firestore"
import firebase from "firebase"

export type AddWithTimestampFnType = (
  collection: string,
  data: Record<string, any>,
  docRef?: (
    db: firebase.firestore.Firestore
  ) => firebase.firestore.DocumentReference
) => Promise<Record<string, any> & HasServerTimestamp>

export type FindByIdFnType = (
  collection: string,
  id: string
) => Promise<QueryResult | undefined>

interface LoadFirestoreImplFunctions {
  mockAddWithTimestamp?: jest.MockedFunction<AddWithTimestampFnType>
  mockFindById?: jest.MockedFunction<FindByIdFnType>
}

export function mockLoadFirestoreImpl(mocks: LoadFirestoreImplFunctions) {
  const mockLoadFirestore = loadFirestore as jest.MockedFunction<
    typeof loadFirestore
  >
  mockLoadFirestore.mockImplementationOnce(() => {
    return Promise.resolve<Firestore>({
      addWithTimestamp: mocks.mockAddWithTimestamp
        ? mocks.mockAddWithTimestamp
        : (jest.fn() as jest.MockedFunction<AddWithTimestampFnType>),
      findById: mocks.mockFindById
        ? mocks.mockFindById
        : (jest.fn() as jest.MockedFunction<FindByIdFnType>),
    })
  })
}
