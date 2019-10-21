export default interface Fixtures {
  collection: string
  fixtures: Fixture[]
}

interface Fixture {
  id: string
  data: { [key: string]: any }
}
