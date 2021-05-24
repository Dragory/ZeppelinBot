import { utilityCmd } from "../types";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { sendErrorMessage } from "../../../pluginUtils";
import { getEmojiInfoEmbed } from "../functions/getEmojiInfoEmbed";
import { getCustomEmojiId } from "../functions/getCustomEmojiId";

export const EmojiInfoCmd = utilityCmd({
  trigger: ["emoji", "emojiinfo"],
  description: "Show information about an emoji",
  usage: "!emoji 106391128718245888",
  permission: "can_emojiinfo",

  signature: {
    emoji: ct.string({ required: false }),
  },

  async run({ message, args, pluginData }) {
    const emojiId = getCustomEmojiId(args.emoji);
    if (!emojiId) {
      sendErrorMessage(pluginData, message.channel, "Emoji not found");
      return;
    }

    const embed = await getEmojiInfoEmbed(pluginData, emojiId);
    if (!embed) {
      sendErrorMessage(pluginData, message.channel, "Emoji not found");
      return;
    }

    message.channel.createMessage({ embed });
  },
});
