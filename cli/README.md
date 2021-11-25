# wedding-manager

Admin tool to manage wedding data

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [wedding-manager](#wedding-manager)
- [Setup](#setup)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Setup

## Service account files

The CLI interacts with Firebase, and for this it requires service account
credentials for the project in question. To obtain new service account
credentials, go to the Service Accounts tab under project settings on the
Firebase Console, and `Generate new private key` for Node.js. You can reference
the private key file as a flag on the command line, or under the `firebase` key
in the [config file](https://oclif.io/docs/config) for the CLI tool.

# Usage

<!-- usage -->

```sh-session
$ npm install -g @alisha-and-milind-wedding/cli
$ wedding-manager COMMAND
running command...
$ wedding-manager (-v|--version|version)
@alisha-and-milind-wedding/cli/0.1.0 darwin-x64 node-v16.13.0
$ wedding-manager --help [COMMAND]
USAGE
  $ wedding-manager COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`wedding-manager contacts:export`](#wedding-manager-contactsexport)
- [`wedding-manager help [COMMAND]`](#wedding-manager-help-command)
- [`wedding-manager invite:gen-codes`](#wedding-manager-invitegen-codes)
- [`wedding-manager invite:update`](#wedding-manager-inviteupdate)
- [`wedding-manager rsvp:export`](#wedding-manager-rsvpexport)
- [`wedding-manager shortid [FILE]`](#wedding-manager-shortid-file)

## `wedding-manager contacts:export`

Export contacts stored in Firestore, as a table.

```
USAGE
  $ wedding-manager contacts:export

OPTIONS
  -f, --firebase=firebase    path to Firebase service account credentials
  -g, --google=google        path to Google API credentials JSON
  -h, --help                 show CLI help
  -m, --mailchimp=mailchimp  Mailchimp API key
  -x, --extended             show extra columns
  --after=after              ID of document cursor (results will be retrieved after this document)
  --columns=columns          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --filter=filter            filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=csv|json|yaml     output in a more machine friendly format
  --sort=sort                property to sort by (prepend '-' for descending)

EXAMPLES
  $ wedding-manager contacts:export -f path/to/service-account.json
  $ wedding-manager contacts:export -f path/to/service-account.json --after hs83kshdgk82ax
  $ wedding-manager contacts:export -f path/to/service-account.json --filter=name=John --sort=-created
  $ wedding-manager contacts:export -f path/to/service-account.json --csv
```

## `wedding-manager help [COMMAND]`

display help for wedding-manager

```
USAGE
  $ wedding-manager help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code:
[@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.5/src/commands/help.ts)_

## `wedding-manager invite:gen-codes`

Generate invitation codes for a table of guest parties in Google Sheets.

```
USAGE
  $ wedding-manager invite:gen-codes

OPTIONS
  -f, --firebase=firebase        path to Firebase service account credentials
  -g, --google=google            path to Google API credentials JSON
  -h, --help                     show CLI help
  -m, --mailchimp=mailchimp      Mailchimp API key

  --range=range                  (required) Range of existing table spanning 2 columns. The first column is where IDs
                                 will be written; the second column is used to determine how many IDs to write (e.g.
                                 'Guest Parties!A:B')

  --spreadsheetId=spreadsheetId  (required) ID of Google Spreadsheet for existing contacts

EXAMPLE
  $ wedding-manager invite:gen-codes --spreadsheetId 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms --range 'Guest
  Parties!A:B'
```

## `wedding-manager invite:update`

Update invitation and invitee records in Firestore and Mailchimp using CSV
exports from Google Sheets.

```
USAGE
  $ wedding-manager invite:update

OPTIONS
  -f, --firebase=firebase                  path to Firebase service account credentials
  -g, --google=google                      path to Google API credentials JSON
  -h, --help                               show CLI help
  -m, --mailchimp=mailchimp                Mailchimp API key
  --ceremonySegmentId=ceremonySegmentId    Mailchimp segment ID for Ceremony tag
  --dryRun                                 Do not write records to any services
  --emails=emails                          (required) CSV containing email information from A+M wedding spreadsheet
  --haldiSegmentId=haldiSegmentId          Mailchimp segment ID for Haldi tag
  --listId=listId                          Mailchimp list ID for invitees
  --parties=parties                        (required) CSV containing party information from A+M wedding spreadsheet
  --pujaSegmentId=pujaSegmentId            Mailchimp segment ID for Puja tag
  --receptionSegmentId=receptionSegmentId  Mailchimp segment ID for Reception tag
  --sangeetSegmentId=sangeetSegmentId      Mailchimp segment ID for Sangeet tag

EXAMPLES
  $ wedding-manager invite:update --parties ~/workspace/guest_parties.csv --emails ~/workspace/known_emails.csv --listId
  fs92kghse --haldiSegmentId 29671
  $ wedding-manager invite:update --parties ~/workspace/guest_parties.csv --emails ~/workspace/known_emails.csv --listId
  fs92kghse --haldiSegmentId 29671 --dryRun
```

## `wedding-manager rsvp:export`

Export RSVPs stored in Firestore, as a table.

```
USAGE
  $ wedding-manager rsvp:export

OPTIONS
  -f, --firebase=firebase    path to Firebase service account credentials
  -g, --google=google        path to Google API credentials JSON
  -h, --help                 show CLI help
  -m, --mailchimp=mailchimp  Mailchimp API key
  -x, --extended             show extra columns
  --columns=columns          only show provided columns (comma-separated)
  --csv                      output is csv format [alias: --output=csv]
  --event=event              Name of event to produce list of names
  --filter=filter            filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --oldDate                  Show RSVPs older than before the event was rescheduled
  --output=csv|json|yaml     output in a more machine friendly format
  --sort=sort                property to sort by (prepend '-' for descending)

EXAMPLES
  $ wedding-manager rsvp:export
  $ wedding-manager rsvp:export -f path/to/service-account.json --after hs83kshdgk82ax
  $ wedding-manager rsvp:export -f path/to/service-account.json --filter=code=skhaWhgk2 --sort=-created
  $ wedding-manager rsvp:export -f path/to/service-account.json --csv
  $ wedding-manager rsvp:export -f path/to/service-account.json --event haldi
```

## `wedding-manager shortid [FILE]`

Generate a set of shortids

```
USAGE
  $ wedding-manager shortid [FILE]

OPTIONS
  -h, --help           show CLI help
  -n, --number=number  [default: 1] number of IDs to generate
```

<!-- commandsstop -->
