import { guildEventListener } from "knub";
import { AutomodContext, AutomodPluginType } from "../types";
import { runAutomod } from "../functions/runAutomod";

export const RunAutomodOnVoiceLeave = guildEventListener<AutomodPluginType>()(
  "voiceChannelLeave",
  ({ pluginData, args: { member, oldChannel } }) => {
    const context: AutomodContext = {
      member,
      timestamp: Date.now(),
      voiceChannel: oldChannel,
      user: member.user,
    };

    pluginData.state.queue.add(() => {
      runAutomod(pluginData, context);
    });
  },
);
