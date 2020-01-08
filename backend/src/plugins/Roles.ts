import { ZeppelinPlugin, trimPluginDescription } from "./ZeppelinPlugin";
import * as t from "io-ts";
import { tNullable } from "src/utils";
import { decorators as d, IPluginOptions, logger, waitForReaction, waitForReply } from "knub";
import { Attachment, Constants as ErisConstants, Guild, Member, Message, TextChannel, User } from "eris";
import { GuildLogs } from "src/data/GuildLogs";

const ConfigSchema = t.type({
    can_assign: t.boolean,
    assignable_roles: tNullable(t.array(t.string))
  });  
type TConfigSchema = t.TypeOf<typeof ConfigSchema>;

enum RoleActions{
    Add,
    Remove
};
  
export class RolesPlugin extends ZeppelinPlugin<TConfigSchema> {
  public static pluginName = "roles";
  public static configSchema = ConfigSchema;

  public static pluginInfo = {
    prettyName: "Roles",
    description: trimPluginDescription(`
      Enables authorised users to add and remove whitelisted roles with a command.
    `),
  };
  protected logs: GuildLogs;

  onLoad(){
    this.logs = new GuildLogs(this.guildId);
  }

  public static getStaticDefaultOptions(): IPluginOptions<TConfigSchema> {
    return {
      config: {
        can_assign: false,
        assignable_roles: null
      },
      overrides: [
        {
          level: ">=50",
          config: {
            can_assign: true,
          },
        },
      ],
    };
  }


  @d.command("role", "<action:string> <user:string> <role:string>",{
      extra: {
        info: {
          description: "Assign a permitted role to a user",
        },
      },
    })
  @d.permission("can_assign")
  async assignRole(msg, args: {action: string; user: string; role: string}){
    const user = await this.resolveUser(args.user);
    console.log(user);
    if (!user) {
      return this.sendErrorMessage(msg.channel, `User not found`);
    }

    //if the role doesnt exist, we can exit
    let roleIds = (msg.channel as TextChannel).guild.roles.map(x => x.id)
    if(!(roleIds.includes(args.role))){
      return this.sendErrorMessage(msg.channel, `Role not found`);
    } 

    // If the user exists as a guild member, make sure we can act on them first
    const member = await this.getMember(user.id);
    if (member && !this.canActOn(msg.member, member)) {
      this.sendErrorMessage(msg.channel, "Cannot add or remove roles on this user: insufficient permissions");
      return;
    }

    const action: string = args.action[0].toUpperCase() + args.action.slice(1).toLowerCase();
    if(!RoleActions[action]){
      this.sendErrorMessage(msg.channel, "Cannot add or remove roles on this user: invalid action");
    }

    //check if the role is allowed to be applied
    

    console.log("exited at the end"); 
  }
    
}