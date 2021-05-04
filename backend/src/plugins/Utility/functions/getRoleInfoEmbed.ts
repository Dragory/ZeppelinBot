import { EmbedOptions, Role } from "eris";
import { GuildPluginData } from "knub";
import { UtilityPluginType } from "../types";
import { trimLines, preEmbedPadding, EmbedWith } from "../../../utils";
import moment from "moment-timezone";
import humanizeDuration from "humanize-duration";
import { TimeAndDatePlugin } from "../../TimeAndDate/TimeAndDatePlugin";

const MENTION = "https://cdn.discordapp.com/attachments/705009450855039042/839284872152481792/mention.png";

export async function getRoleInfoEmbed(
  pluginData: GuildPluginData<UtilityPluginType>,
  role: Role,
  requestMemberId?: string,
): Promise<EmbedOptions> {
  const embed: EmbedWith<"fields"> = {
    fields: [],
  };

  embed.author = {
    name: `Role:  ${role.name}`,
    icon_url: MENTION,
  };

  embed.color = role.color;

  const createdAt = moment.utc(role.createdAt, "x");
  const timeAndDate = pluginData.getPlugin(TimeAndDatePlugin);
  const tzCreatedAt = requestMemberId
    ? await timeAndDate.inMemberTz(requestMemberId, createdAt)
    : timeAndDate.inGuildTz(createdAt);
  const prettyCreatedAt = tzCreatedAt.format(timeAndDate.getDateFormat("pretty_datetime"));
  const roleAge = humanizeDuration(Date.now() - role.createdAt, {
    largest: 2,
    round: true,
  });

  const rolePerms = Object.keys(role.permissions.json)
    .map(p =>
      p
        .replace(/^voice/i, "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .replace(/(^\w{1})|(\s{1}\w{1})/g, l => l.toUpperCase()),
    )
    .join(", ");

  embed.fields.push({
    name: preEmbedPadding + "Role information",
    value: trimLines(`
      Name: **${role.name}**
      ID: \`${role.id}\`
      Created: **${roleAge} ago** (\`${prettyCreatedAt}\`)
      Position: **${role.position}**
      Color: **#${role.color
        .toString(16)
        .toUpperCase()
        .padStart(6, "0")}**
      Mentionable: **${role.mentionable ? "Yes" : "No"}**
      Hoisted: **${role.hoist ? "Yes" : "No"}**
      Permissions: \`${rolePerms}\`
      Mention: <@&${role.id}> (\`<@&${role.id}>\`)
    `),
  });

  return embed;
}
