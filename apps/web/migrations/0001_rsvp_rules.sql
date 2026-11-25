-- Custom migration (`drizzle-kit generate --custom`): what the Drizzle
-- schema (src/server/db/schema.ts) can't express.

-- Reference data: events, invitation types and which events each type may
-- RSVP to (the matrix in src/interfaces/Invitation.ts).
INSERT INTO events (event) VALUES
  ('puja'), ('haldi'), ('sangeet'), ('ceremony'), ('reception');
--> statement-breakpoint
INSERT INTO itypes (itype) VALUES
  ('a'), ('psr'), ('pr'), ('w'), ('ow'), ('sr'), ('r');
--> statement-breakpoint
INSERT INTO itype_events (itype, event) VALUES
  ('a', 'puja'), ('a', 'haldi'), ('a', 'sangeet'), ('a', 'ceremony'), ('a', 'reception'),
  ('psr', 'puja'), ('psr', 'haldi'), ('psr', 'sangeet'), ('psr', 'reception'),
  ('pr', 'puja'), ('pr', 'haldi'), ('pr', 'reception'),
  ('w', 'sangeet'), ('w', 'ceremony'), ('w', 'reception'),
  ('ow', 'ceremony'), ('ow', 'reception'),
  ('sr', 'sangeet'), ('sr', 'reception'),
  ('r', 'reception');
--> statement-breakpoint

-- The parts of firestore.rules' RSVP `create` rule that depend on the
-- invitation or on the guests' contents.
CREATE TRIGGER rsvps_validate BEFORE INSERT ON rsvps
BEGIN
  SELECT RAISE(ABORT, 'rsvp: unknown invitation')
  WHERE NOT EXISTS (SELECT 1 FROM invitations WHERE code = NEW.code);

  SELECT RAISE(ABORT, 'rsvp: more guests than invited')
  WHERE json_array_length(NEW.guests)
    > (SELECT num_guests FROM invitations WHERE code = NEW.code);

  SELECT RAISE(ABORT, 'rsvp: invalid guest')
  WHERE EXISTS (
    SELECT 1 FROM json_each(NEW.guests) AS g
    WHERE g.type <> 'object'
      OR json_type(g.value, '$.name') IS NOT 'text'
      OR json_type(g.value, '$.events') IS NOT 'array'
      -- Blank names (whitespace only) are not names.
      OR trim(
        json_extract(g.value, '$.name'),
        char(9, 10, 11, 12, 13, 32, 160, 8232, 8233, 12288, 65279)
      ) = ''
  );

  SELECT RAISE(ABORT, 'rsvp: events given when not attending')
  WHERE NEW.attending = 0 AND EXISTS (
    SELECT 1 FROM json_each(NEW.guests) AS g
    WHERE json_array_length(g.value, '$.events') > 0
  );

  SELECT RAISE(ABORT, 'rsvp: event not open to this invitation')
  WHERE EXISTS (
    SELECT 1
    FROM json_each(NEW.guests) AS g, json_each(g.value, '$.events') AS e
    WHERE e.type <> 'text'
      OR NOT EXISTS (
        SELECT 1
        FROM invitations AS i
        JOIN itype_events AS ie ON ie.itype = i.itype
        WHERE i.code = NEW.code AND ie.event = e.value
      )
  );
END;
