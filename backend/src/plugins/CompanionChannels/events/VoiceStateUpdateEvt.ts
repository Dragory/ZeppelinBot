import { companionChannelsEvt } from "../types";
import { handleCompanionPermissions } from "../functions/handleCompanionPermissions";

export const VoiceStateUpdateEvt = companionChannelsEvt({
  event: "voiceStateUpdate",
  listener({ pluginData, args: { oldState, newState } }) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const memberId = newState.member ? newState.member.id : oldState.member!.id;
    handleCompanionPermissions(pluginData, memberId, newChannel, oldChannel);
  },
});
