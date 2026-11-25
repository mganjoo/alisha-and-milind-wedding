/**
 * The D1 schema: source of truth for the tables, their constraints and the
 * row types. `pnpm db:generate` (drizzle-kit) turns changes into migrations
 * in ../../../migrations. What Drizzle can't express (the reference data and
 * the RSVP validation trigger) is in the custom migration
 * migrations/0001_rsvp_rules.sql.
 *
 * Split of responsibilities:
 * - here (SQL constraints): column types, required columns, foreign keys
 *   (invitation existence), guest count bounds, lower-cased emails, the
 *   contacts test sentinel;
 * - custom SQL (trigger): guest count vs. the invitation, non-blank guest
 *   names, per-itype event permissions, "no events when not attending";
 * - API (src/server/*): request shape (allowed/required keys, JSON types),
 *   read visibility (inactive rows, test sentinels), get-by-id only, server-set
 *   timestamps.
 *
 * Drizzle can't declare STRICT tables, so each column's storage type is
 * enforced by a `typeof()` CHECK instead (D1 always enforces foreign keys).
 */
import { type SQL, sql } from "drizzle-orm"
import {
  check,
  index,
  integer,
  primaryKey,
  type SQLiteColumn,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core"
import type { Rsvp } from "../../interfaces/Invitation"

type StorageType = "integer" | "text"

/** What STRICT would enforce: the column holds `type` (or NULL if allowed). */
function stores(
  table: string,
  column: SQLiteColumn,
  type: StorageType,
  nullable = false
) {
  const allowed: SQL = nullable
    ? sql`typeof(${column}) IN (${sql.raw(`'${type}'`)}, 'null')`
    : sql`typeof(${column}) = ${sql.raw(`'${type}'`)}`
  return check(`${table}_${column.name}_type`, allowed)
}

const isBoolean = (column: SQLiteColumn) => sql`${column} IN (0, 1)`

// Reference data (rows inserted by the custom migration).

export const events = sqliteTable(
  "events",
  { event: text().primaryKey() },
  (t) => [stores("events", t.event, "text")]
)

/** Invitation types; see the matrix in src/interfaces/Invitation.ts. */
export const itypes = sqliteTable(
  "itypes",
  { itype: text().primaryKey() },
  (t) => [stores("itypes", t.itype, "text")]
)

/** Which events each invitation type may RSVP to (firestore.rules validEvents). */
export const itypeEvents = sqliteTable(
  "itype_events",
  {
    itype: text()
      .notNull()
      .references(() => itypes.itype),
    event: text()
      .notNull()
      .references(() => events.event),
  },
  (t) => [
    primaryKey({ columns: [t.itype, t.event] }),
    stores("itype_events", t.itype, "text"),
    stores("itype_events", t.event, "text"),
  ]
)

export type Itype = "a" | "psr" | "pr" | "w" | "ow" | "sr" | "r"

export const invitations = sqliteTable(
  "invitations",
  {
    code: text().primaryKey(),
    partyName: text("party_name").notNull(),
    numGuests: integer("num_guests").notNull(),
    knownGuests: text("known_guests", { mode: "json" })
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'`),
    itype: text()
      .$type<Itype>()
      .notNull()
      .references(() => itypes.itype),
    inactive: integer({ mode: "boolean" }).notNull().default(false),
    /** First/last fetch through the public API (unix ms). Never returned. */
    firstViewedAt: integer("first_viewed_at"),
    lastViewedAt: integer("last_viewed_at"),
  },
  (t) => [
    check("invitations_code_nonempty", sql`length(${t.code}) > 0`),
    // Same bounds as InvitationSchema (0 < numGuests < 15).
    check(
      "invitations_num_guests_range",
      sql`${t.numGuests} > 0 AND ${t.numGuests} < 15`
    ),
    check(
      "invitations_known_guests_array",
      sql`json_valid(${t.knownGuests}) AND json_type(${t.knownGuests}) = 'array'`
    ),
    check("invitations_inactive_boolean", isBoolean(t.inactive)),
    check(
      "invitations_viewed_positive",
      sql`(${t.firstViewedAt} IS NULL OR ${t.firstViewedAt} > 0) AND (${t.lastViewedAt} IS NULL OR ${t.lastViewedAt} > 0)`
    ),
    stores("invitations", t.code, "text"),
    stores("invitations", t.partyName, "text"),
    stores("invitations", t.numGuests, "integer"),
    stores("invitations", t.knownGuests, "text"),
    stores("invitations", t.itype, "text"),
    stores("invitations", t.inactive, "integer"),
    stores("invitations", t.firstViewedAt, "integer", true),
    stores("invitations", t.lastViewedAt, "integer", true),
  ]
)

/** One row per email address (lower-cased), as the `invitees` collection. */
export const invitees = sqliteTable(
  "invitees",
  {
    email: text().primaryKey(),
    name: text().notNull(),
    code: text()
      .notNull()
      .references(() => invitations.code),
    inactive: integer({ mode: "boolean" }).notNull().default(false),
  },
  (t) => [
    index("invitees_code").on(t.code),
    check(
      "invitees_email_lower",
      sql`${t.email} = lower(${t.email}) AND length(${t.email}) > 0`
    ),
    check("invitees_inactive_boolean", isBoolean(t.inactive)),
    stores("invitees", t.email, "text"),
    stores("invitees", t.name, "text"),
    stores("invitees", t.code, "text"),
    stores("invitees", t.inactive, "integer"),
  ]
)

export const rsvps = sqliteTable(
  "rsvps",
  {
    id: text().primaryKey(),
    code: text()
      .notNull()
      .references(() => invitations.code),
    attending: integer({ mode: "boolean" }).notNull(),
    /** JSON array of {"name": string, "events": string[]}, at least one. */
    guests: text({ mode: "json" }).$type<Rsvp["guests"]>().notNull(),
    comments: text(),
    /** Unix epoch milliseconds, set by the server. */
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    // Serves "latest RSVP of an invitation" (newest created_at; SQLite
    // appends the rowid to every index entry, which breaks ties).
    index("rsvps_code_created").on(t.code, t.createdAt),
    check("rsvps_attending_boolean", isBoolean(t.attending)),
    check(
      "rsvps_guests_nonempty_array",
      sql`json_valid(${t.guests}) AND json_type(${t.guests}) = 'array' AND json_array_length(${t.guests}) > 0`
    ),
    check("rsvps_created_at_positive", sql`${t.createdAt} > 0`),
    stores("rsvps", t.id, "text"),
    stores("rsvps", t.code, "text"),
    stores("rsvps", t.attending, "integer"),
    stores("rsvps", t.guests, "text"),
    stores("rsvps", t.comments, "text", true),
    stores("rsvps", t.createdAt, "integer"),
  ]
)

/**
 * Outgoing notification emails (was the `mail` collection, in the Firebase
 * "Trigger Email" extension format). Nothing sends them yet.
 */
export const mail = sqliteTable(
  "mail",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    recipient: text().notNull(),
    subject: text().notNull(),
    html: text().notNull(),
    rsvpId: text("rsvp_id").references(() => rsvps.id),
    createdAt: integer("created_at").notNull(),
    sentAt: integer("sent_at"),
  },
  (t) => [
    stores("mail", t.recipient, "text"),
    stores("mail", t.subject, "text"),
    stores("mail", t.html, "text"),
    stores("mail", t.rsvpId, "text", true),
    stores("mail", t.createdAt, "integer"),
    stores("mail", t.sentAt, "integer", true),
  ]
)

export const contacts = sqliteTable(
  "contacts",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    email: text().notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    // Test sentinel from firestore.rules.
    check("contacts_not_rejected", sql`${t.name} <> '__reject_submission__'`),
    check("contacts_created_at_positive", sql`${t.createdAt} > 0`),
    stores("contacts", t.name, "text"),
    stores("contacts", t.email, "text"),
    stores("contacts", t.createdAt, "integer"),
  ]
)

export type InvitationRow = typeof invitations.$inferSelect
export type NewInvitation = typeof invitations.$inferInsert
export type InviteeRow = typeof invitees.$inferSelect
export type NewInvitee = typeof invitees.$inferInsert
export type RsvpRow = typeof rsvps.$inferSelect
export type MailRow = typeof mail.$inferSelect
