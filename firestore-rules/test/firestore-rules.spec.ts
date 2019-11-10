import * as firebase from "@firebase/testing"
import { equal } from "assert"
import fs from "fs"

const projectId = "test-rules"
const rules = fs.readFileSync("../firestore.rules", "utf8")

function firestore() {
  return firebase
    .initializeTestApp({
      projectId,
    })
    .firestore()
}

function contacts() {
  return firestore().collection("contacts")
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
})
