import * as firebase from "@firebase/testing"
import * as fs from "fs"

const projectId = "test-rules"
const rules = fs.readFileSync("../firestore.rules", "utf8")

function firestore(): firebase.firestore.Firestore {
  return firebase
    .initializeTestApp({
      projectId,
    })
    .firestore()
}

function firestoreAdmin(): firebase.firestore.Firestore {
  return firebase
    .initializeAdminApp({
      projectId,
    })
    .firestore()
}

function contacts(): firebase.firestore.CollectionReference {
  return firestore().collection("contacts")
}

function rsvps(invitationId: string): firebase.firestore.CollectionReference {
  return firestore()
    .collection("invitations")
    .doc(invitationId)
    .collection("rsvps")
}

describe("Firestore rules", () => {
  before(async () => firebase.loadFirestoreRules({ projectId, rules }))
  beforeEach(async () => firebase.clearFirestoreData({ projectId }))
  after(async () => Promise.all(firebase.apps().map(app => app.delete())))

  describe("for Contacts collection", () => {
    it("should allow writes containing name, email and createdAt timestamp", async () => {
      await firebase.assertSucceeds(
        contacts().add({
          name: "Lorem Ipsum",
          email: "lorem@example.com",
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes with missing name", async () => {
      await firebase.assertFails(
        contacts().add({
          email: "lorem@example.com",
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes with missing email", async () => {
      await firebase.assertFails(
        contacts().add({
          name: "Jack Jones",
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes with missing timestamp", async () => {
      await firebase.assertFails(
        contacts().add({
          name: "Jack Jones",
          email: "jack.jones@gmail.com",
        })
      )
    })

    it("should reject writes with timestamp of wrong type", async () => {
      await firebase.assertFails(
        contacts().add({
          name: "Jack Jones",
          email: "jack.jones@gmail.com",
          timestamp: "wrong type",
        })
      )
    })

    it("should reject writes with extra fields", async () => {
      await firebase.assertFails(
        contacts().add({
          name: "Lorem Ipsum",
          email: "lorem@example.com",
          extra: true,
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject all reads", async () => {
      await firebase.assertFails(
        contacts()
          .where("name", "==", "Jack Jones")
          .get()
      )
    })
  })

  describe("for Invitations/Rsvps collection", () => {
    beforeEach(async () => {
      await firestoreAdmin()
        .collection("invitations")
        .doc("abc")
        .set({
          code: "abc",
          partyName: "Terry Gordon & Family",
          numGuests: 3,
          knownGuests: ["Terry Gordon", "Allison Little", "Arnold James"],
          preEvents: true,
        })
      await firestoreAdmin()
        .collection("invitations")
        .doc("xyz")
        .set({
          code: "xyz",
          partyName: "John Jacobs",
          numGuests: 3,
          knownGuests: ["JohnJacobs"],
        })
    })

    it("should allow writes containing attending, guests, and createdAt timestamp", async () => {
      await firebase.assertSucceeds(
        rsvps("abc").add({
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "mehendi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
            {
              name: "Vishal Shekhar",
              events: ["sangeet", "ceremony"],
            },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes containing missing timestamp", async () => {
      await firebase.assertFails(
        rsvps("abc").add({
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
      await firebase.assertFails(
        rsvps("abc").add({
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "mehendi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes containing missing guest list", async () => {
      await firebase.assertFails(
        rsvps("abc").add({
          attending: true,
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes containing empty guest list", async () => {
      await firebase.assertFails(
        rsvps("abc").add({
          attending: true,
          guests: [],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes for non-existent code", async () => {
      await firebase.assertFails(
        rsvps("non_existent").add({
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "ceremony"],
            },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes containing more guests than invited", async () => {
      await firebase.assertFails(
        rsvps("abc").add({
          attending: true,
          guests: [
            {
              name: "Terry Gordon",
              events: ["sangeet", "mehendi", "ceremony"],
            },
            { name: "Allison Little", events: ["sangeet"] },
            {
              name: "Vishal Shekhar",
              events: ["sangeet", "ceremony"],
            },
            { name: "Betsy Crocker", events: ["ceremony"] },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes where guest map does not contain name", async () => {
      await firebase.assertFails(
        rsvps("abc").add({
          attending: true,
          guests: [
            {
              events: ["sangeet", "mehendi", "ceremony"],
            },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes where guest name is empty", async () => {
      await firebase.assertFails(
        rsvps("abc").add({
          attending: true,
          guests: [
            {
              name: "   ",
              events: ["sangeet", "mehendi", "ceremony"],
            },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes where events list has invalid name", async () => {
      await firebase.assertFails(
        rsvps("abc").add({
          attending: true,
          guests: [
            {
              name: "John James",
              events: ["sangeet", "whatever", "ceremony"],
            },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })

    it("should reject writes where the events are not consistent with preEvents", async () => {
      await firebase.assertFails(
        rsvps("xyz").add({
          attending: true,
          guests: [
            {
              name: "John Jacobs",
              events: ["sangeet", "mehendi", "ceremony"],
            },
          ],
          createdAt: firebase.firestore.Timestamp.now(),
        })
      )
    })
  })
})
