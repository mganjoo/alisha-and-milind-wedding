import firebase from "firebase"
import {
  loadFirestore,
  Firestore,
  HasServerTimestamp,
  QueryResult,
} from "../services/Firestore"

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

export type FindUniqueByKeyFnType = (
  collection: string,
  key: string,
  value: any
) => Promise<QueryResult | undefined>

interface LoadFirestoreImplFunctions {
  mockAddWithTimestamp?: jest.MockedFunction<AddWithTimestampFnType>
  mockFindById?: jest.MockedFunction<FindByIdFnType>
  mockFindUniqueByKey?: jest.MockedFunction<FindUniqueByKeyFnType>
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
      findUniqueByKey: mocks.mockFindUniqueByKey
        ? mocks.mockFindUniqueByKey
        : (jest.fn() as jest.MockedFunction<FindByIdFnType>),
    })
  })
}
