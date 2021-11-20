import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing"
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  setLogLevel,
  where,
  CollectionReference,
  DocumentData,
  Timestamp,
} from "firebase/firestore"
import { readFileSync } from "fs"

const projectId = "demo-alisha-and-milind-wedding"
const rules = readFileSync("../firestore.rules", "utf8")

let testEnv: RulesTestEnvironment

async function initializeCollection(
  coll: string,
  docId: string,
  data: DocumentData
) {
  await testEnv.withSecurityRulesDisabled(
    async (context) => await setDoc(doc(context.firestore(), coll, docId), data)
  )
}

function contacts(): CollectionReference {
  return collection(testEnv.unauthenticatedContext().firestore(), "contacts")
}

function invitations(): CollectionReference {
  return collection(testEnv.unauthenticatedContext().firestore(), "invitations")
}

function rsvps(invitationId: string): CollectionReference {
  return collection(
    doc(
      testEnv.unauthenticatedContext().firestore(),
      "invitations",
      invitationId
    ),
    "rsvps"
  )
}

function invitees(): CollectionReference {
  return collection(testEnv.unauthenticatedContext().firestore(), "invitees")
}

describe("Firestore rules", () => {
  beforeAll(async () => {
    // Silence expected read errors
    setLogLevel("error")
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: { rules },
    })
  })
  beforeEach(async () => testEnv.clearFirestore())
  afterAll(async () => testEnv.cleanup())

  describe("for Contacts collection", () => {
    it("should allow writes containing name, email and createdAt timestamp", async () => {
      await assertSucceeds(
        addDoc(contacts(), {
          name: "Lorem Ipsum",
          email: "lorem@example.com",
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes with missing name", async () => {
      await assertFails(
        addDoc(contacts(), {
          email: "lorem@example.com",
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes with missing email", async () => {
      await assertFails(
        addDoc(contacts(), {
          name: "Jack Jones",
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes with missing timestamp", async () => {
      await assertFails(
        addDoc(contacts(), {
          name: "Jack Jones",
          email: "jack.jones@gmail.com",
        })
      )
    })

    it("should reject writes with timestamp of wrong type", async () => {
      await assertFails(
        addDoc(contacts(), {
          name: "Jack Jones",
          email: "jack.jones@gmail.com",
          timestamp: "wrong type",
        })
      )
    })

    it("should reject writes with extra fields", async () => {
      await assertFails(
        addDoc(contacts(), {
          name: "Lorem Ipsum",
          email: "lorem@example.com",
          extra: true,
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes with special field", async () => {
      await assertFails(
        addDoc(contacts(), {
          name: "__reject_submission__",
          email: "lorem@example.com",
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject all reads", async () => {
      await assertFails(
        getDocs(query(contacts(), where("name", "==", "Jack Jones")))
      )
    })
  })

  describe("for Invitations collection", () => {
    it("should allow reading a single non-existent code", async () => {
      await assertSucceeds(getDoc(doc(invitations(), "abc")))
    })

    it("should allow reading a single code with 'inactive' unset", async () => {
      await initializeCollection("invitations", "abc", {
        code: "abc",
        partyName: "Terry Gordon & Family",
        numGuests: 3,
        knownGuests: ["Terry Gordon", "Allison Little", "Arnold James"],
      })
      await assertSucceeds(getDoc(doc(invitations(), "abc")))
    })

    it("should reject reading a single code with 'inactive' set", async () => {
      await initializeCollection("invitations", "abc", {
        code: "abc",
        partyName: "Terry Gordon & Family",
        numGuests: 3,
        knownGuests: ["Terry Gordon", "Allison Little", "Arnold James"],
        inactive: true,
      })
      await assertFails(getDoc(doc(invitations(), "abc")))
    })

    it("should reject queries for codes", async () => {
      await assertFails(
        getDocs(query(invitees(), where("partyName", ">", "a")))
      )
    })
  })

  describe("for Invitees collection", () => {
    it("should allow reading a single non-existent email", async () => {
      await assertSucceeds(getDoc(doc(invitees(), "abc")))
    })

    it("should allow reading a single email with 'inactive' unset", async () => {
      await initializeCollection("invitees", "abc@example.com", {
        name: "Jack Jones",
        code: "abc",
      })
      await assertSucceeds(getDoc(doc(invitees(), "abc@example.com")))
    })

    it("should reject reading a single email with 'inactive' set", async () => {
      await initializeCollection("invitees", "abc@example.com", {
        name: "Jack Jones",
        code: "abc",
        inactive: true,
      })
      await assertFails(getDoc(doc(invitees(), "abc@example.com")))
    })

    it("should reject query for special email", async () => {
      await assertFails(
        getDoc(doc(invitees(), "__reject_request__@example.com"))
      )
    })

    it("should reject queries for emails", async () => {
      await assertFails(getDocs(query(invitees(), where("email", ">", "a"))))
    })
  })

  describe("for Invitations/Rsvps collection", () => {
    beforeEach(async () => {
      await initializeCollection("invitations", "abc", {
        code: "abc",
        partyName: "Terry Gordon & Family",
        numGuests: 3,
        knownGuests: ["Terry Gordon", "Allison Little", "Arnold James"],
        itype: "a",
      })
      await initializeCollection("invitations", "xyz", {
        code: "xyz",
        partyName: "John Jacobs",
        numGuests: 3,
        knownGuests: ["JohnJacobs"],
        itype: "w",
      })
      await initializeCollection("invitations", "efg", {
        code: "efg",
        partyName: "Chandler Bing",
        numGuests: 1,
        itype: "sr",
        knownGuests: ["Chandler Bing"],
      })
      await initializeCollection("invitations", "ghi", {
        code: "ghi",
        partyName: "James Johnson",
        numGuests: 1,
        itype: "r",
        knownGuests: ["James Johnson"],
      })
    })

    it("should allow writes containing attending, guests, and createdAt timestamp", async () => {
      await assertSucceeds(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "mehndi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
            {
              name: "Vishal Shekhar",
              events: ["sangeet", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should allow writes containing attending, guests, comments and createdAt timestamp", async () => {
      await assertSucceeds(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "mehndi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
            {
              name: "Vishal Shekhar",
              events: ["sangeet", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
          comments: "Hope to have a fun time!",
        })
      )
    })

    it("should reject writes containing missing timestamp", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
          ],
        })
      )
    })

    it("should reject writes containing missing attending status", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "mehndi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes containing missing guest list", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes containing comments of invalid type", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
          ],
          comments: 1234,
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes containing empty guest list", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes for non-existent code", async () => {
      await assertFails(
        addDoc(rsvps("non_existent"), {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes containing more guests than invited", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "mehndi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
            {
              name: "Vishal Shekhar",
              events: ["sangeet", "ceremony"],
            },
            { name: "Betsy Crocker", events: ["ceremony"] },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes where guest map does not contain name", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              events: ["sangeet", "mehndi", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes where guest name is empty", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              name: "   ",
              events: ["sangeet", "mehndi", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes where events list has invalid name", async () => {
      await assertFails(
        addDoc(rsvps("abc"), {
          attending: true,
          guests: [
            {
              name: "John James",
              events: ["sangeet", "whatever", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes when itype != a, RSVP includes pre-events", async () => {
      await assertFails(
        // itype = w
        addDoc(rsvps("xyz"), {
          attending: true,
          guests: [
            {
              name: "John Jacobs",
              events: ["sangeet", "mehndi", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
      // itype = sr
      await assertFails(
        addDoc(rsvps("efg"), {
          attending: true,
          guests: [
            {
              name: "Chandler Bing",
              events: ["sangeet", "mehndi", "reception"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
      // itype = r
      await assertFails(
        addDoc(rsvps("ghi"), {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["haldi", "reception"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should accept writes when itype != a, RSVP does not include pre-events", async () => {
      await assertSucceeds(
        // itype = w
        addDoc(rsvps("xyz"), {
          attending: true,
          guests: [
            {
              name: "John Jacobs",
              events: ["sangeet", "ceremony", "reception"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes when itype != a and itype != w, RSVP includes ceremony", async () => {
      await assertFails(
        // itype = sr
        addDoc(rsvps("efg"), {
          attending: true,
          guests: [
            {
              name: "Chandler Bing",
              events: ["sangeet", "ceremony"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
      await assertFails(
        // itype = r
        addDoc(rsvps("ghi"), {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["ceremony", "reception"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should accept writes when itype != a and itype != w, RSVP does not include ceremony", async () => {
      await assertSucceeds(
        // itype = sr
        addDoc(rsvps("efg"), {
          attending: true,
          guests: [
            {
              name: "Chandler Bing",
              events: ["sangeet", "reception"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should reject writes when itype = r, RSVP includes sangeet", async () => {
      await assertFails(
        // itype = r
        addDoc(rsvps("ghi"), {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["sangeet", "reception"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })

    it("should accept writes when itype = r, RSVP does not include sangeet", async () => {
      await assertSucceeds(
        // itype = r
        addDoc(rsvps("ghi"), {
          attending: true,
          guests: [
            {
              name: "James Johnson",
              events: ["reception"],
            },
          ],
          createdAt: Timestamp.now(),
        })
      )
    })
  })
})
