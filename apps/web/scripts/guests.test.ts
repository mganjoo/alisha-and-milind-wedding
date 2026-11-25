// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs"
import { DatabaseSync } from "node:sqlite"
import Papa from "papaparse"
import { describe, expect, it } from "vitest"
import {
  describePlan,
  generateCode,
  generateUniqueCode,
  inlineSql,
  isValidCode,
  parseEmails,
  parseItype,
  planImport,
  sqlString,
  toSql,
  yn,
} from "./guests.ts"

// The e2e fixtures' parties and emails, minus the ones whose codes are too
// short for the 2022 code check (test1, test2, test3), plus two parties
// without codes.
const fixture = (name: string) =>
  readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8")

const partiesCsv = fixture("parties.csv")
const emailsCsv = fixture("emails.csv")

const partiesHeader =
  "code,uniquePartyName,partyName,numGuests," +
  Array.from({ length: 11 }, (_, i) => `knownGuest${i + 1}`).join(",") +
  ",preEvents,ceremony,sangeet"

/** One parties CSV row; knownGuests fill knownGuest1..n. */
function partyRow(p: {
  code?: string
  name: string
  numGuests?: number | string
  knownGuests?: string[]
  flags?: [string, string, string] // preEvents, ceremony, sangeet
}) {
  const known = p.knownGuests ?? []
  return [
    p.code ?? "",
    p.name,
    `${p.name} Party`,
    p.numGuests ?? 2,
    ...known,
    ...Array(11 - known.length).fill(""),
    ...(p.flags ?? ["n", "n", "n"]),
  ].join(",")
}

const parties = (...rows: string[]) => [partiesHeader, ...rows].join("\n")
const emails = (...rows: string[]) =>
  ["name,email,cleanedName,skip,uniquePartyName", ...rows].join("\n")

/** Deterministic code generator. */
function sequence(...codes: string[]) {
  let i = 0
  return () => codes[i++] ?? `fallback${i}`
}

describe("yn", () => {
  it("accepts y/yes in any case", () => {
    for (const v of ["y", "Y", "yes", "YES", "Yes"]) expect(yn(v)).toBe(true)
    for (const v of ["n", "", "no", "yy", " y", undefined]) {
      expect(yn(v)).toBe(false)
    }
  })
})

describe("parseItype", () => {
  it.each([
    [true, true, true, "a"],
    [true, true, false, "psr"],
    [true, false, false, "pr"],
    [false, true, true, "w"],
    [false, false, true, "ow"],
    [false, true, false, "sr"],
    [false, false, false, "r"],
    [true, false, true, undefined],
  ] as const)("preEvents=%s sangeet=%s ceremony=%s -> %s", (p, s, c, itype) => {
    expect(parseItype(p, s, c)).toBe(itype)
  })

  it("maps the CSV columns (preEvents, ceremony, sangeet)", () => {
    const plan = planImport({
      partiesCsv: parties(
        partyRow({ code: "code01", name: "A", flags: ["y", "n", "y"] }),
        partyRow({ code: "code02", name: "B", flags: ["n", "y", "n"] })
      ),
      emailsCsv: emails(),
    })
    expect(plan.parties.map((p) => p.itype)).toEqual(["psr", "ow"])
  })

  it("rejects pre-events plus ceremony without sangeet", () => {
    expect(() =>
      planImport({
        partiesCsv: parties(partyRow({ name: "A", flags: ["y", "y", "n"] })),
        emailsCsv: emails(),
      })
    ).toThrow(/Could not generate itype for invitation A/)
  })
})

describe("codes", () => {
  it("generates 9 characters of the shortid alphabet", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateCode()
      expect(code).toMatch(/^[0-9a-zA-Z_-]{9}$/)
      expect(isValidCode(code)).toBe(true)
    }
  })

  it("accepts 2022 shortid codes and rejects others", () => {
    expect(isValidCode("t9Hq-f_Or")).toBe(true)
    expect(isValidCode("test2")).toBe(false) // too short for shortid
    expect(isValidCode("t:iHqfOorR")).toBe(false)
    expect(isValidCode("abc def")).toBe(false)
  })

  it("skips codes that are taken", () => {
    const taken = new Set(["aaaaaaaaa", "bbbbbbbbb"])
    const code = generateUniqueCode(
      taken,
      sequence("aaaaaaaaa", "bbbbbbbbb", "ccccccccc")
    )
    expect(code).toBe("ccccccccc")
    expect(taken.has("ccccccccc")).toBe(true)
  })

  it("gives up rather than loop forever", () => {
    expect(() => generateUniqueCode(new Set(["x"]), () => "x")).toThrow(
      /unique invitation code/
    )
  })

  it("avoids existing database codes and codes in the CSV", () => {
    const plan = planImport({
      partiesCsv: parties(
        partyRow({ name: "New1" }),
        partyRow({ code: "inthecsv", name: "Old" }),
        partyRow({ name: "New2" })
      ),
      emailsCsv: emails(),
      existingCodes: ["indatabase"],
      generate: sequence(
        "indatabase",
        "inthecsv",
        "fresh0001",
        "fresh0001",
        "fresh0002"
      ),
    })
    expect(plan.parties.map((p) => [p.code, p.generated])).toEqual([
      ["fresh0001", true],
      ["inthecsv", false],
      ["fresh0002", true],
    ])
  })

  it("rejects invalid codes in the CSV", () => {
    expect(() =>
      planImport({
        partiesCsv: parties(partyRow({ code: "no:pe!", name: "A" })),
        emailsCsv: emails(),
      })
    ).toThrow(/parties row 2: code is not a valid invitation code/)
  })
})

describe("parseEmails", () => {
  it("drops skipped rows, prefers cleanedName and trims", () => {
    expect(
      parseEmails(
        emails(
          " raw name , A@Example.com ,Clean Name,,P1",
          "Dup,a@example.com,,y,P1",
          "No Party,np@example.com,,,"
        )
      )
    ).toEqual([
      { name: "Clean Name", email: "A@Example.com", uniquePartyName: "P1" },
      { name: "No Party", email: "np@example.com", uniquePartyName: undefined },
    ])
  })

  it("rejects duplicate emails, ignoring case", () => {
    expect(() =>
      parseEmails(emails("A,a@example.com,,,", "B,A@example.com,,,"))
    ).toThrow(/duplicate emails detected: a@example.com/)
  })

  it("validates rows", () => {
    expect(() => parseEmails(emails("A,not-an-email,,,"))).toThrow(
      /emails row 2: email/
    )
    expect(() => parseEmails(emails(",a@example.com,,,"))).toThrow(
      /emails row 2: name/
    )
    expect(() => parseEmails(emails("A,a@example.com,,maybe,"))).toThrow(
      /emails row 2: skip/
    )
  })
})

describe("planImport", () => {
  it("validates numGuests and known guests", () => {
    const plan = (row: Parameters<typeof partyRow>[0]) => () =>
      planImport({ partiesCsv: parties(partyRow(row)), emailsCsv: emails() })
    expect(plan({ name: "A", numGuests: "two" })).toThrow(/numGuests/)
    expect(plan({ name: "A", numGuests: 0 })).toThrow(/numGuests/)
    expect(plan({ name: "A", numGuests: 15 })).toThrow(/numGuests/)
    expect(plan({ name: "A", numGuests: 1, knownGuests: ["X", "Y"] })).toThrow(
      /known guests exceed numGuests\): A/
    )
    expect(plan({ name: "A", flags: ["maybe", "n", "n"] })).toThrow(/preEvents/)
  })

  it("rejects duplicate party names and codes", () => {
    expect(() =>
      planImport({
        partiesCsv: parties(
          partyRow({ code: "code0001", name: "A" }),
          partyRow({ code: "code0001", name: "A" })
        ),
        emailsCsv: emails(),
      })
    ).toThrow(/duplicate codes: code0001\nduplicate uniquePartyName values: A/)
  })

  it("plans the fixture import", () => {
    const plan = planImport({
      partiesCsv,
      emailsCsv,
      generate: sequence("NewCode01", "NewCode02"),
    })
    expect(plan.parties).toHaveLength(8)
    const rao = plan.parties.find((p) => p.uniquePartyName === "Rao")
    expect(rao).toMatchObject({
      code: "NewCode01",
      generated: true,
      partyName: "Anjali Rao & Family",
      numGuests: 4,
      knownGuests: ["Anjali Rao", "Vikram Rao"],
      itype: "psr",
    })
    expect(plan.parties.find((p) => p.code === "test32")?.itype).toBe("sr")
    // Lower-cased invitee emails, the skipped duplicate dropped, the
    // cleaned name used, and only emails with a party imported.
    expect(plan.invitees).toHaveLength(9)
    expect(plan.invitees).toContainEqual({
      email: "meera.iyer@example.com",
      name: "Meera Iyer",
      code: "testrsvpapi",
    })
    expect(plan.invitees).toContainEqual({
      email: "anjali.rao@example.com",
      name: "Anjali Rao",
      code: "NewCode01",
    })
    expect(plan.unmatchedEmails.map((e) => e.email)).toEqual([
      "sam.lee@example.com",
    ])
  })

  it("writes the parties CSV back with the generated codes", () => {
    const plan = planImport({
      partiesCsv,
      emailsCsv,
      generate: sequence("NewCode01", "NewCode02"),
    })
    const original = Papa.parse<Record<string, string>>(partiesCsv, {
      header: true,
      skipEmptyLines: true,
    })
    const written = Papa.parse<Record<string, string>>(
      plan.partiesCsvWithCodes,
      { header: true, skipEmptyLines: true }
    )
    expect(written.meta.fields).toEqual(original.meta.fields)
    expect(written.data.map((r) => r.code)).toEqual([
      ...original.data.slice(0, 6).map((r) => r.code),
      "NewCode01",
      "NewCode02",
    ])
    // Everything else is unchanged.
    expect(written.data.map(({ code: _, ...rest }) => rest)).toEqual(
      original.data.map(({ code: _, ...rest }) => rest)
    )
  })

  it("is stable when re-imported with the written CSV", () => {
    const first = planImport({ partiesCsv, emailsCsv })
    const second = planImport({
      partiesCsv: first.partiesCsvWithCodes,
      emailsCsv,
    })
    expect(second.parties.every((p) => !p.generated)).toBe(true)
    expect(toSql(second)).toBe(toSql(first))
    expect(second.partiesCsvWithCodes).toBe(first.partiesCsvWithCodes)
  })

  it("keeps CRLF line breaks (Google Sheets exports)", () => {
    const crlf = partiesCsv.replaceAll("\n", "\r\n")
    const plan = planImport({ partiesCsv: crlf, emailsCsv })
    expect(plan.partiesCsvWithCodes.endsWith("y,n,n\r\n")).toBe(true)
    expect(plan.partiesCsvWithCodes.replaceAll("\r\n", "")).not.toMatch(/\n/)
    expect(() =>
      planImport({ partiesCsv: plan.partiesCsvWithCodes, emailsCsv })
    ).not.toThrow()
  })
})

describe("SQL", () => {
  const leah = {
    code: "c1",
    generated: false,
    uniquePartyName: "D",
    partyName: "Leah D'Souza",
    numGuests: 2,
    knownGuests: ["Leah D'Souza", 'Q "Quote"?'],
    itype: "pr" as const,
    emails: [],
  }

  /** A fresh SQLite database with the real migrations applied. */
  function migratedDb() {
    const db = new DatabaseSync(":memory:")
    db.exec("PRAGMA foreign_keys = ON")
    const dir = new URL("../migrations/", import.meta.url)
    for (const file of readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort()) {
      db.exec(readFileSync(new URL(file, dir), "utf8"))
    }
    return db
  }

  it("quotes strings", () => {
    expect(sqlString("D'Souza")).toBe("'D''Souza'")
  })

  it("inlines Drizzle's parameters", () => {
    expect(
      inlineSql({ sql: "select ?, ?, ?, ?", params: ["a'?", 3, true, null] })
    ).toBe("select 'a''?', 3, 1, NULL;")
    expect(() => inlineSql({ sql: "select ?", params: [] })).toThrow(
      /parameter count/
    )
    expect(() => inlineSql({ sql: "select ?", params: [1.5] })).toThrow(
      /unexpected SQL parameter/
    )
  })

  it("emits one upsert per invitation, then per invitee", () => {
    const lines = toSql({
      parties: [leah],
      invitees: [
        { email: "leah@example.com", name: "Leah D'Souza", code: "c1" },
      ],
    }).split("\n")
    expect(lines[0]).toBe("-- Guest import: 1 invitations, 1 invitees.")
    expect(lines[1]).toMatch(
      /^insert into "invitations" .* on conflict .* do update set "party_name" = excluded.party_name, "num_guests" = excluded.num_guests, "known_guests" = excluded.known_guests, "itype" = excluded.itype;$/
    )
    expect(lines[1]).toContain(`'["Leah D''Souza","Q \\"Quote\\"?"]'`)
    expect(lines[2]).toMatch(
      /^insert into "invitees" .* do update set "name" = excluded.name, "code" = excluded.code;$/
    )
  })

  it("applies to the real schema and only touches imported columns", () => {
    const db = migratedDb()
    db.exec(
      `INSERT INTO invitations (code, party_name, num_guests, itype, inactive, first_viewed_at)
       VALUES ('c1', 'Old', 1, 'r', 1, 5);
       INSERT INTO invitees (email, name, code, inactive) VALUES ('leah@example.com', 'Old', 'c1', 1);`
    )
    const plan = planImport({ partiesCsv, emailsCsv })
    const sql = toSql({
      parties: [leah, ...plan.parties],
      invitees: [
        { email: "leah@example.com", name: "Leah D'Souza", code: "c1" },
        ...plan.invitees,
      ],
    })
    db.exec(sql)
    db.exec(sql) // idempotent
    expect(
      db
        .prepare(
          "SELECT party_name, num_guests, known_guests, itype, inactive, first_viewed_at FROM invitations WHERE code = 'c1'"
        )
        .get()
    ).toEqual({
      party_name: "Leah D'Souza",
      num_guests: 2,
      known_guests: JSON.stringify(leah.knownGuests),
      itype: "pr",
      inactive: 1,
      first_viewed_at: 5,
    })
    expect(
      db
        .prepare(
          "SELECT name, inactive FROM invitees WHERE email = 'leah@example.com'"
        )
        .get()
    ).toEqual({ name: "Leah D'Souza", inactive: 1 })
    expect(db.prepare("SELECT count(*) AS n FROM invitations").get()).toEqual({
      n: 9,
    })
    expect(db.prepare("SELECT count(*) AS n FROM invitees").get()).toEqual({
      n: 10,
    })
    expect(
      db.prepare("SELECT inactive FROM invitations WHERE code = 'testr2'").get()
    ).toEqual({ inactive: 0 })
  })
})

describe("describePlan", () => {
  it("separates new and updated records", () => {
    const plan = planImport({
      partiesCsv,
      emailsCsv,
      generate: sequence("NewCode01", "NewCode02"),
    })
    const text = describePlan(plan, {
      codes: new Set(["test32", "testr2"]),
      emails: new Set(["richa.kalyana@example.com"]),
    })
    expect(text).toContain("Invitations: 8 (6 new, 2 updated, 2 new codes)")
    expect(text).toContain("Invitees: 9 (8 new, 1 updated)")
    expect(text).toContain(
      "New codes:\n  Rao -> NewCode01\n  D'Souza -> NewCode02"
    )
    expect(text).toContain(
      "Updated invitations:\n  test32  Virat Kohli & Anushka Sharma (3 guests, itype sr)\n  testr2"
    )
    expect(text).toContain(
      "Updated invitees:\n  richa.kalyana@example.com -> testr2 (Richa Kalyana)"
    )
    expect(text).toContain(
      "Skipped emails (no matching party):\n  sam.lee@example.com (no party)"
    )
  })
})
