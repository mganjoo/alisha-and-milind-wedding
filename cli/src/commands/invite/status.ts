import BaseCommand from "../../util/base-command"
import { cli } from "cli-ux"
import _ from "lodash"

export default class InviteStatus extends BaseCommand {
  static description = "Get open status of sent invitations."

  static examples = [`$ wedding-manager invite:status --folderId efa13b8032`]

  static args = [
    {
      name: "folderId",
      required: true,
      description: "ID of folder with matching campaigns",
    },
    {
      name: "type",
      required: true,
      description: "Type of status to show: opened/unopened",
      options: ["opened", "unopened"],
    },
  ]

  static flags = {
    ...BaseCommand.flags,
    ...cli.table.flags(),
  }

  async run() {
    const { args, flags } = await this.parse(InviteStatus)

    await this.initializeServices({ mailchimp: true })

    if (!this.mailchimp) {
      this.error("Mailchimp client not available")
    }

    cli.action.start("reading campaigns from folder")
    const campaignIdsResult = await this.mailchimp.get({
      path: "/campaigns",
      query: {
        folder_id: args.folderId,
      },
    })
    cli.action.stop()
    const campaignIds: string[] = campaignIdsResult.campaigns
      ? campaignIdsResult.campaigns.map((r: any) => r.id)
      : []

    cli.action.start("reading sent info")
    const sentToResults = await this.mailchimp.batch(
      campaignIds.map((id) => ({
        method: "get",
        path: "/reports/{campaignId}/sent-to",
        path_params: {
          campaignId: id,
        },
      })),
      { verbose: false }
    )
    const statuses: {
      code: string
      name: string
      partyName: string
      email: string
      openCount: number
    }[] = sentToResults.flatMap((r: any) =>
      r.sent_to
        .filter((s: any) => !!s.merge_fields)
        .map((s: any) => ({
          code: s.merge_fields.WCODE,
          name: s.merge_fields.NAME,
          partyName: s.merge_fields.PARTY,
          email: s.email_address,
          openCount: s.open_count,
        }))
    )
    cli.action.stop()

    const statusesWithDedupedEmails = Object.entries(
      _.groupBy(statuses, "email")
    ).map(([email, statuses]) =>
      statuses.reduce((left, right) => ({
        code: right.code,
        name: right.name,
        partyName: right.partyName,
        email,
        openCount: left.openCount + right.openCount,
      }))
    )
    const statusesByInvitationCode = _.groupBy(
      statusesWithDedupedEmails,
      "code"
    )

    let results: Record<string, unknown>[] | undefined = undefined
    if (args.type === "unopened") {
      results = Object.entries(statusesByInvitationCode)
        .filter(([, statuses]) => statuses.every((s) => s.openCount === 0))
        .map(([code, statuses]) => ({
          code,
          partyName: statuses[0].partyName,
          recipients: statuses.map((s) => s.email).join("; "),
        }))
    } else if (args.type === "opened") {
      results = Object.entries(statusesByInvitationCode)
        .filter(([, statuses]) => statuses.some((s) => s.openCount > 0))
        .map(([code, statuses]) => ({
          code,
          partyName: statuses[0].partyName,
          recipients: statuses
            .map((s) => `${s.email}: ${s.openCount}`)
            .join("; "),
        }))
    } else {
      this.error("invalid type for status display")
    }

    if (results) {
      cli.table(
        results,
        {
          code: {},
          partyName: { header: "Party Name" },
          recipients: {},
        },
        { ...flags, sort: flags.sort || "code" }
      )
    }
  }
}
