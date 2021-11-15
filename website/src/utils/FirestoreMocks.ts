import { Firestore as TFirestore, DocumentReference } from "@firebase/firestore"
import {
  loadFirestore,
  HasServerTimestamp,
  QueryResult,
} from "../services/Firestore"

export type AddWithTimestampFnType = (
  collection: string,
  data: Record<string, any>,
  docRef?: (db: TFirestore) => DocumentReference
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
  mockLoadFirestore.mockImplementation(() => {
    return {
      addWithTimestamp: mocks.mockAddWithTimestamp
        ? mocks.mockAddWithTimestamp
        : (jest.fn() as jest.MockedFunction<AddWithTimestampFnType>),
      findById: mocks.mockFindById
        ? mocks.mockFindById
        : (jest.fn() as jest.MockedFunction<FindByIdFnType>),
    }
  })
}
