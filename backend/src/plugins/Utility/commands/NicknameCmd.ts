import { utilityCmd } from "../types";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { disableBold, errorMessage } from "../../../utils";
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
    if (!args.nickname) {
      if (!args.member.nick) {
        msg.channel.createMessage(`<@!${args.member.id}> does not have a nickname`);
      } else {
        msg.channel.createMessage(`The nickname of <@!${args.member.id}> is **${disableBold(args.nickname)}**`);
      }
      return;
    }

    if (msg.member.id !== args.member.id && !canActOn(pluginData, msg.member, args.member)) {
      msg.channel.createMessage(errorMessage("Cannot change nickname: insufficient permissions"));
      return;
    }

    const nicknameLength = [...args.nickname].length;
    if (nicknameLength < 2 || nicknameLength > 32) {
      msg.channel.createMessage(errorMessage("Nickname must be between 2 and 32 characters long"));
      return;
    }

    const oldNickname = args.member.nick || "<none>";

    try {
      await args.member.edit({
        nick: args.nickname,
      });
    } catch {
      msg.channel.createMessage(errorMessage("Failed to change nickname"));
      return;
    }

    sendSuccessMessage(
      pluginData,
      msg.channel,
      `Changed nickname of <@!${args.member.id}> from **${oldNickname}** to **${args.nickname}**`,
    );
  },
});
