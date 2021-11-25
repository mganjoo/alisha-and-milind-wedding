interface Fixture {
  id: string
  data: Record<string, any>
}

export const invitations =
  require("../fixtures/invitation-fixtures.json") as Fixture[]
export const invitees =
  require("../fixtures/invitees-fixtures.json") as Fixture[]

// Events
export const events = ["puja", "haldi", "sangeet", "ceremony", "reception"]
