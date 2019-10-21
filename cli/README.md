# wedding-manager

Admin tool to manage wedding data

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g wedding-manager
$ wedding-manager COMMAND
running command...
$ wedding-manager (-v|--version|version)
wedding-manager/0.0.0 darwin-x64 node-v12.11.1
$ wedding-manager --help [COMMAND]
USAGE
  $ wedding-manager COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`wedding-manager export-contacts`](#wedding-manager-export-contacts)
- [`wedding-manager help [COMMAND]`](#wedding-manager-help-command)
- [`wedding-manager load-fixtures PATH`](#wedding-manager-load-fixtures-path)

## `wedding-manager export-contacts`

Export contacts stored in Firestore

```
USAGE
  $ wedding-manager export-contacts

OPTIONS
  -c, --credentials=credentials  path to service account credentials
  -h, --help                     show CLI help
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --csv                          output is csv format
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --sort=sort                    property to sort by (prepend '-' for descending)

EXAMPLES
  $ wedding-manager export-contacts -c path/to/service-account.json
  $ wedding-manager export-contacts -c path/to/service-account.json -x --filter=name=John --sort=-created
```

_See code: [src/commands/export-contacts.ts](https://github.com/mganjoo/wedding-manager/blob/v0.0.0/src/commands/export-contacts.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `wedding-manager load-fixtures PATH`

Load fixtures into Firestore from data in fixtures/ folder

```
USAGE
  $ wedding-manager load-fixtures PATH

ARGUMENTS
  PATH  path to fixtures JSON file

OPTIONS
  -c, --credentials=credentials  path to service account credentials
  -h, --help                     show CLI help

EXAMPLE
  $ wedding-manager load-fixtures -c path/to/service-account.json invitations
```

_See code: [src/commands/load-fixtures.ts](https://github.com/mganjoo/wedding-manager/blob/v0.0.0/src/commands/load-fixtures.ts)_

<!-- commandsstop -->
