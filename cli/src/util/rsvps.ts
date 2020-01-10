import admin from "firebase-admin"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import _ from "lodash"

dayjs.extend(utc)

const events = ["haldi", "mehndi", "sangeet", "ceremony", "reception"]

interface Rsvp {
  id: string
  code: string
  attending: boolean
  guests: { events: string[]; name: string }[]
  comments: string
  createdAt: FirebaseFirestore.Timestamp
}

export async function getRsvps() {
  const invitationsRef = admin.firestore().collection("invitations")
  const rsvpsRef = admin.firestore().collectionGroup("rsvps")
  const snapshot = await rsvpsRef.get()
  const rsvps = snapshot.docs.map(
    doc =>
      ({
        id: doc.ref.id,
        code: doc.ref.parent.parent ? doc.ref.parent.parent.id : undefined,
        ...doc.data(),
      } as Rsvp)
  )
  const partyNames = await Promise.all(
    rsvps.map(rsvp =>
      invitationsRef
        .doc(rsvp.code)
        .get()
        .then(snapshot => {
          const data = snapshot.data()
          return {
            code: rsvp.code,
            partyName: data ? (data.partyName as string) : undefined,
          }
        })
    )
  )
  const partyNamesByCode = _.keyBy(partyNames, party => party.code)
  const filteredRsvps = Object.values(
    _.chain(rsvps)
      .groupBy(rsvp => rsvp.code)
      .mapValues(rsvps => _.maxBy(rsvps, "createdAt"))
      .flatMap(rsvps => rsvps || [])
      .value()
  )
  return _.chain(filteredRsvps)
    .map(({ createdAt, comments, ...other }) => {
      const attendingCountsByEvent = _.chain(events)
        .map(event => ({
          event: event,
          count: other.guests.filter(guest => guest.events.includes(event))
            .length,
        }))
        .keyBy(event => event.event)
        .mapValues(value => value.count)
        .value()
      return {
        ...other,
        ...attendingCountsByEvent,
        partyName:
          other.code in partyNamesByCode
            ? partyNamesByCode[other.code].partyName
            : undefined,
        comments: comments || "",
        created: dayjs(createdAt.toDate())
          .utc()
          .format("YYYY-MM-DD HH:mm:ss"),
        guest1: other.guests[0] ? other.guests[0].name : "",
        guest2: other.guests[1] ? other.guests[1].name : "",
        guest3: other.guests[2] ? other.guests[2].name : "",
        guest4: other.guests[3] ? other.guests[3].name : "",
        guest5: other.guests[4] ? other.guests[4].name : "",
        guest6: other.guests[5] ? other.guests[5].name : "",
        guest7: other.guests[6] ? other.guests[6].name : "",
      }
    })
    .value()
}
