# wedding-manager

Admin tool to manage wedding data

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [wedding-manager](#wedding-manager)
- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @alisha-and-milind-wedding/cli
$ wedding-manager COMMAND
running command...
$ wedding-manager (-v|--version|version)
@alisha-and-milind-wedding/cli/0.1.0 darwin-x64 node-v12.12.0
$ wedding-manager --help [COMMAND]
USAGE
  $ wedding-manager COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`wedding-manager contacts:export`](#wedding-manager-contactsexport)
- [`wedding-manager contacts:sync`](#wedding-manager-contactssync)
- [`wedding-manager help [COMMAND]`](#wedding-manager-help-command)
- [`wedding-manager shortid [FILE]`](#wedding-manager-shortid-file)

## `wedding-manager contacts:export`

Export contacts stored in Firestore, as a table

```
USAGE
  $ wedding-manager contacts:export

OPTIONS
  -f, --firebase=firebase  path to Firebase service account credentials
  -g, --google=google      path to Google API credentials JSON
  -h, --help               show CLI help
  -x, --extended           show extra columns
  --after=after            ID of document cursor (results will be retrieved after this document)
  --columns=columns        only show provided columns (comma-separated)
  --csv                    output is csv format
  --filter=filter          filter property by partial string matching, ex: name=foo
  --no-header              hide table header from output
  --no-truncate            do not truncate output to fit screen
  --sort=sort              property to sort by (prepend '-' for descending)

EXAMPLES
  $ wedding-manager contacts:export -f path/to/service-account.json
  $ wedding-manager contacts:export -f path/to/service-account.json --after hs83kshdgk82ax
  $ wedding-manager contacts:export -f path/to/service-account.json --filter=name=John --sort=-created
  $ wedding-manager contacts:export -f path/to/service-account.json --csv
```

## `wedding-manager contacts:sync`

Sync contacts stored in Firestore with a table in Google Sheets. Finds the latest ID stored in the Google Sheet and appends new rows to the table for new IDs.

```
USAGE
  $ wedding-manager contacts:sync

OPTIONS
  -f, --firebase=firebase        path to Firebase service account credentials
  -g, --google=google            path to Google API credentials JSON
  -h, --help                     show CLI help
  --range=range                  (required) Range of existing table containing 4 rows (e.g. 'Known Emails!A:D')
  --spreadsheetId=spreadsheetId  (required) ID of Google Spreadsheet for existing contacts

EXAMPLE
  $ wedding-manager contacts:sync --spreadsheetId 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms --range 'Known
  Emails!A:D'
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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

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
