CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "contacts_not_rejected" CHECK("contacts"."name" <> '__reject_submission__'),
	CONSTRAINT "contacts_created_at_positive" CHECK("contacts"."created_at" > 0),
	CONSTRAINT "contacts_name_type" CHECK(typeof("contacts"."name") = 'text'),
	CONSTRAINT "contacts_email_type" CHECK(typeof("contacts"."email") = 'text'),
	CONSTRAINT "contacts_created_at_type" CHECK(typeof("contacts"."created_at") = 'integer')
);
--> statement-breakpoint
CREATE TABLE `events` (
	`event` text PRIMARY KEY NOT NULL,
	CONSTRAINT "events_event_type" CHECK(typeof("events"."event") = 'text')
);
--> statement-breakpoint
CREATE TABLE `invitations` (
	`code` text PRIMARY KEY NOT NULL,
	`party_name` text NOT NULL,
	`num_guests` integer NOT NULL,
	`known_guests` text DEFAULT '[]' NOT NULL,
	`itype` text NOT NULL,
	`inactive` integer DEFAULT false NOT NULL,
	`first_viewed_at` integer,
	`last_viewed_at` integer,
	FOREIGN KEY (`itype`) REFERENCES `itypes`(`itype`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "invitations_code_nonempty" CHECK(length("invitations"."code") > 0),
	CONSTRAINT "invitations_num_guests_range" CHECK("invitations"."num_guests" > 0 AND "invitations"."num_guests" < 15),
	CONSTRAINT "invitations_known_guests_array" CHECK(json_valid("invitations"."known_guests") AND json_type("invitations"."known_guests") = 'array'),
	CONSTRAINT "invitations_inactive_boolean" CHECK("invitations"."inactive" IN (0, 1)),
	CONSTRAINT "invitations_viewed_positive" CHECK(("invitations"."first_viewed_at" IS NULL OR "invitations"."first_viewed_at" > 0) AND ("invitations"."last_viewed_at" IS NULL OR "invitations"."last_viewed_at" > 0)),
	CONSTRAINT "invitations_code_type" CHECK(typeof("invitations"."code") = 'text'),
	CONSTRAINT "invitations_party_name_type" CHECK(typeof("invitations"."party_name") = 'text'),
	CONSTRAINT "invitations_num_guests_type" CHECK(typeof("invitations"."num_guests") = 'integer'),
	CONSTRAINT "invitations_known_guests_type" CHECK(typeof("invitations"."known_guests") = 'text'),
	CONSTRAINT "invitations_itype_type" CHECK(typeof("invitations"."itype") = 'text'),
	CONSTRAINT "invitations_inactive_type" CHECK(typeof("invitations"."inactive") = 'integer'),
	CONSTRAINT "invitations_first_viewed_at_type" CHECK(typeof("invitations"."first_viewed_at") IN ('integer', 'null')),
	CONSTRAINT "invitations_last_viewed_at_type" CHECK(typeof("invitations"."last_viewed_at") IN ('integer', 'null'))
);
--> statement-breakpoint
CREATE TABLE `invitees` (
	`email` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`code` text NOT NULL,
	`inactive` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`code`) REFERENCES `invitations`(`code`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "invitees_email_lower" CHECK("invitees"."email" = lower("invitees"."email") AND length("invitees"."email") > 0),
	CONSTRAINT "invitees_inactive_boolean" CHECK("invitees"."inactive" IN (0, 1)),
	CONSTRAINT "invitees_email_type" CHECK(typeof("invitees"."email") = 'text'),
	CONSTRAINT "invitees_name_type" CHECK(typeof("invitees"."name") = 'text'),
	CONSTRAINT "invitees_code_type" CHECK(typeof("invitees"."code") = 'text'),
	CONSTRAINT "invitees_inactive_type" CHECK(typeof("invitees"."inactive") = 'integer')
);
--> statement-breakpoint
CREATE INDEX `invitees_code` ON `invitees` (`code`);--> statement-breakpoint
CREATE TABLE `itype_events` (
	`itype` text NOT NULL,
	`event` text NOT NULL,
	PRIMARY KEY(`itype`, `event`),
	FOREIGN KEY (`itype`) REFERENCES `itypes`(`itype`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`event`) REFERENCES `events`(`event`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "itype_events_itype_type" CHECK(typeof("itype_events"."itype") = 'text'),
	CONSTRAINT "itype_events_event_type" CHECK(typeof("itype_events"."event") = 'text')
);
--> statement-breakpoint
CREATE TABLE `itypes` (
	`itype` text PRIMARY KEY NOT NULL,
	CONSTRAINT "itypes_itype_type" CHECK(typeof("itypes"."itype") = 'text')
);
--> statement-breakpoint
CREATE TABLE `mail` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`recipient` text NOT NULL,
	`subject` text NOT NULL,
	`html` text NOT NULL,
	`rsvp_id` text,
	`created_at` integer NOT NULL,
	`sent_at` integer,
	FOREIGN KEY (`rsvp_id`) REFERENCES `rsvps`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "mail_recipient_type" CHECK(typeof("mail"."recipient") = 'text'),
	CONSTRAINT "mail_subject_type" CHECK(typeof("mail"."subject") = 'text'),
	CONSTRAINT "mail_html_type" CHECK(typeof("mail"."html") = 'text'),
	CONSTRAINT "mail_rsvp_id_type" CHECK(typeof("mail"."rsvp_id") IN ('text', 'null')),
	CONSTRAINT "mail_created_at_type" CHECK(typeof("mail"."created_at") = 'integer'),
	CONSTRAINT "mail_sent_at_type" CHECK(typeof("mail"."sent_at") IN ('integer', 'null'))
);
--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`attending` integer NOT NULL,
	`guests` text NOT NULL,
	`comments` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`code`) REFERENCES `invitations`(`code`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "rsvps_attending_boolean" CHECK("rsvps"."attending" IN (0, 1)),
	CONSTRAINT "rsvps_guests_nonempty_array" CHECK(json_valid("rsvps"."guests") AND json_type("rsvps"."guests") = 'array' AND json_array_length("rsvps"."guests") > 0),
	CONSTRAINT "rsvps_created_at_positive" CHECK("rsvps"."created_at" > 0),
	CONSTRAINT "rsvps_id_type" CHECK(typeof("rsvps"."id") = 'text'),
	CONSTRAINT "rsvps_code_type" CHECK(typeof("rsvps"."code") = 'text'),
	CONSTRAINT "rsvps_attending_type" CHECK(typeof("rsvps"."attending") = 'integer'),
	CONSTRAINT "rsvps_guests_type" CHECK(typeof("rsvps"."guests") = 'text'),
	CONSTRAINT "rsvps_comments_type" CHECK(typeof("rsvps"."comments") IN ('text', 'null')),
	CONSTRAINT "rsvps_created_at_type" CHECK(typeof("rsvps"."created_at") = 'integer')
);
--> statement-breakpoint
CREATE INDEX `rsvps_code_created` ON `rsvps` (`code`,`created_at`);