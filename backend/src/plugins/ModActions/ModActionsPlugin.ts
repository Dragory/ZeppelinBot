import { zeppelinPlugin } from "../ZeppelinPluginBlueprint";
import { CasesPlugin } from "../Cases/CasesPlugin";
import { MutesPlugin } from "../Mutes/MutesPlugin";
import { ConfigSchema, ModActionsPluginType } from "./types";
import { CreateBanCaseOnManualBanEvt } from "./events/CreateBanCaseOnManualBanEvt";
import { CreateUnbanCaseOnManualUnbanEvt } from "./events/CreateUnbanCaseOnManualUnbanEvt";
import { CreateKickCaseOnManualKickEvt } from "./events/CreateKickCaseOnManualKickEvt";
import { UpdateCmd } from "./commands/UpdateCmd";
import { NoteCmd } from "./commands/NoteCmd";
import { WarnCmd } from "./commands/WarnCmd";
import { MuteCmd } from "./commands/MuteCmd";
import { PostAlertOnMemberJoinEvt } from "./events/PostAlertOnMemberJoinEvt";
import { ForcemuteCmd } from "./commands/ForcemuteCmd";
import { UnmuteCmd } from "./commands/UnmuteCmd";
import { KickCmd } from "./commands/KickCmd";
import { SoftbanCmd } from "./commands/SoftbanCommand";
import { BanCmd } from "./commands/BanCmd";
import { UnbanCmd } from "./commands/UnbanCmd";
import { ForcebanCmd } from "./commands/ForcebanCmd";
import { MassbanCmd } from "./commands/MassBanCmd";
import { AddCaseCmd } from "./commands/AddCaseCmd";
import { CaseCmd } from "./commands/CaseCmd";
import { CasesUserCmd } from "./commands/CasesUserCmd";
import { CasesModCmd } from "./commands/CasesModCmd";
import { HideCaseCmd } from "./commands/HideCaseCmd";
import { UnhideCaseCmd } from "./commands/UnhideCaseCmd";
import { GuildMutes } from "src/data/GuildMutes";
import { GuildCases } from "src/data/GuildCases";
import { GuildLogs } from "src/data/GuildLogs";
import { ForceUnmuteCmd } from "./commands/ForceunmuteCmd";

const defaultOptions = {
  config: {
    dm_on_warn: true,
    dm_on_kick: false,
    dm_on_ban: false,
    message_on_warn: false,
    message_on_kick: false,
    message_on_ban: false,
    message_channel: null,
    warn_message: "You have received a warning on the {guildName} server: {reason}",
    kick_message: "You have been kicked from the {guildName} server. Reason given: {reason}",
    ban_message: "You have been banned from the {guildName} server. Reason given: {reason}",
    alert_on_rejoin: false,
    alert_channel: null,
    warn_notify_enabled: false,
    warn_notify_threshold: 5,
    warn_notify_message:
      "The user already has **{priorWarnings}** warnings!\n Please check their prior cases and assess whether or not to warn anyways.\n Proceed with the warning?",
    ban_delete_message_days: 1,

    can_note: false,
    can_warn: false,
    can_mute: false,
    can_kick: false,
    can_ban: false,
    can_view: false,
    can_addcase: false,
    can_massban: false,
    can_hidecase: false,
    can_act_as_other: false,
  },
  overrides: [
    {
      level: ">=50",
      config: {
        can_note: true,
        can_warn: true,
        can_mute: true,
        can_kick: true,
        can_ban: true,
        can_view: true,
        can_addcase: true,
      },
    },
    {
      level: ">=100",
      config: {
        can_massban: true,
        can_hidecase: true,
        can_act_as_other: true,
      },
    },
  ],
};

export const ModActionsPlugin = zeppelinPlugin<ModActionsPluginType>()("mod_actions", {
  configSchema: ConfigSchema,
  defaultOptions,

  dependencies: [CasesPlugin, MutesPlugin],

  events: [
    CreateBanCaseOnManualBanEvt,
    CreateUnbanCaseOnManualUnbanEvt,
    CreateKickCaseOnManualKickEvt,
    PostAlertOnMemberJoinEvt,
  ],

  commands: [
    UpdateCmd,
    NoteCmd,
    WarnCmd,
    MuteCmd,
    ForcemuteCmd,
    UnmuteCmd,
    ForceUnmuteCmd,
    KickCmd,
    SoftbanCmd,
    BanCmd,
    UnbanCmd,
    ForcebanCmd,
    MassbanCmd,
    AddCaseCmd,
    CaseCmd,
    CasesUserCmd,
    CasesModCmd,
    HideCaseCmd,
    UnhideCaseCmd,
  ],

  onLoad(pluginData) {
    const { state, guild } = pluginData;

    state.mutes = GuildMutes.getGuildInstance(guild.id);
    state.cases = GuildCases.getGuildInstance(guild.id);
    state.serverLogs = new GuildLogs(guild.id);

    state.ignoredEvents = [];
  },
});