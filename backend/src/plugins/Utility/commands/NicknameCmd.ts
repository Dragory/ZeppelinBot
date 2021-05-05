import { utilityCmd } from "../types";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { errorMessage } from "../../../utils";
import { canActOn, sendSuccessMessage } from "../../../pluginUtils";

export const NicknameCmd = utilityCmd({
  trigger: ["nickname", "nick"],
  description: "Set a member's nickname",
  usage: "!nickname 106391128718245888 Drag",
  permission: "can_nickname",

  signature: {
    member: ct.resolvedMember(),
    nickname: ct.string({ catchAll: true, required: false }),
  },

  async run({ message: msg, args, pluginData }) {
    if (msg.member.id !== args.member.id && !canActOn(pluginData, msg.member, args.member)) {
      msg.channel.createMessage(errorMessage("Cannot change nickname: insufficient permissions"));
      return;
    }

    if (!args.nickname && !args.member.nick) {
      msg.channel.createMessage(errorMessage("User does not have a nickname"));
      return;
    }

    const nicknameLength = args.nickname && [...args.nickname].length;
    if (typeof nicknameLength === "number" && (nicknameLength < 2 || nicknameLength > 32)) {
      msg.channel.createMessage(errorMessage("Nickname must be between 2 and 32 characters long"));
      return;
    }

    const oldNickname = args.member.nick || "<none>";

    try {
      await args.member.edit({
        nick: args.nickname ?? "",
      });
    } catch (e) {
      msg.channel.createMessage(errorMessage("Failed to change nickname"));
      return;
    }

    if (args.nickname) {
      sendSuccessMessage(
        pluginData,
        msg.channel,
        `Changed nickname of <@!${args.member.id}> from **${oldNickname}** to **${args.nickname}**`,
      );
    } else {
      sendSuccessMessage(pluginData, msg.channel, `The nickname of <@!${args.member.id}> has been reset`);
    }
  },
});
