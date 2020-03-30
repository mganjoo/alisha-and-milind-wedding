import admin from "firebase-admin"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import _ from "lodash"

dayjs.extend(utc)

const events = ["haldi", "mehndi", "sangeet", "ceremony", "reception"]

// Cutoff for when event was rescheduled
const newDateCutoff = dayjs("2020-03-15").toDate()

interface Rsvp {
  id: string
  code: string
  attending: boolean
  guests: { events: string[]; name: string }[]
  comments: string
  createdAt: FirebaseFirestore.Timestamp
}

interface RsvpWithParty extends Rsvp {
  partyName: string
}

async function getRsvps(oldDate: boolean) {
  const invitationsRef = admin.firestore().collection("invitations")
  const rsvpsRef = admin
    .firestore()
    .collectionGroup("rsvps")
    .where("createdAt", oldDate ? "<" : ">=", newDateCutoff)
  const snapshot = await rsvpsRef.get()
  const rsvps = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.ref.id,
        code: doc.ref.parent.parent ? doc.ref.parent.parent.id : undefined,
        ...doc.data(),
      } as Rsvp)
  )
  const partyNames = await Promise.all(
    rsvps.map((rsvp) =>
      invitationsRef
        .doc(rsvp.code)
        .get()
        .then((snapshot) => {
          const data = snapshot.data()
          return {
            code: rsvp.code,
            partyName: data ? (data.partyName as string) : undefined,
          }
        })
    )
  )
  const partyNamesByCode = _.keyBy(partyNames, (party) => party.code)
  return _.chain(rsvps)
    .groupBy((rsvp) => rsvp.code)
    .mapValues((rsvps) => _.maxBy(rsvps, (rsvp) => rsvp.createdAt.seconds))
    .flatMap((rsvps) => rsvps || [])
    .map(
      (rsvp) =>
        ({
          ...rsvp,
          partyName:
            rsvp.code in partyNamesByCode
              ? partyNamesByCode[rsvp.code].partyName
              : undefined,
        } as RsvpWithParty)
    )
    .value()
}

export async function getRsvpSummaries(oldDate: boolean) {
  const rsvps = await getRsvps(oldDate)
  return _.chain(rsvps)
    .map(({ id, code, partyName, attending, createdAt, comments, guests }) => {
      const attendingCountsByEvent = _.chain(events)
        .map((event) => ({
          event: event,
          count: guests.filter((guest) => guest.events.includes(event)).length,
        }))
        .keyBy((event) => event.event)
        .mapValues((value) => value.count)
        .value()
      return {
        id,
        code,
        partyName,
        attending,
        ...attendingCountsByEvent,
        comments: comments || "",
        created: dayjs(createdAt.toDate())
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
        guest1: guests[0] ? guests[0].name : "",
        guest2: guests[1] ? guests[1].name : "",
        guest3: guests[2] ? guests[2].name : "",
        guest4: guests[3] ? guests[3].name : "",
        guest5: guests[4] ? guests[4].name : "",
        guest6: guests[5] ? guests[5].name : "",
        guest7: guests[6] ? guests[6].name : "",
      }
    })
    .value()
}

export async function getGuestsByEvent(event: string, oldDate: boolean) {
  const rsvps = await getRsvps(oldDate)
  return rsvps
    .filter((rsvp) => rsvp.attending)
    .flatMap((rsvp) => {
      return rsvp.guests
        .filter((guest) => guest.events.includes(event))
        .map((guest) => ({
          guest: guest.name,
          partyName: rsvp.partyName,
          code: rsvp.code,
        }))
    })
}
