import { guildEventListener } from "knub";
import { AutomodContext, AutomodPluginType } from "../types";
import { runAutomod } from "../functions/runAutomod";

export const RunAutomodOnVoiceJoin = guildEventListener<AutomodPluginType>()(
  "voiceChannelJoin",
  ({ pluginData, args: { member, newChannel } }) => {
    const context: AutomodContext = {
      member,
      timestamp: Date.now(),
      voiceChannel: {
        joined: newChannel,
      },
      user: member.user,
    };

    pluginData.state.queue.add(() => {
      runAutomod(pluginData, context);
    });
  },
);
