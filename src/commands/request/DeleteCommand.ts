import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import * as PluginRequest from "./program/PluginRequestProgram";
import * as TextureRequest from "./program/TextureRequestProgram";

export default class DeleteCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "delete", BotUtils.findChannels(TextChannel, '586539557789368340', '586550731142725642'), BotUtils.getRoles(), `刪除目前委託`, [], "resolve");
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {

        if (!PluginRequest.requestMap.delete(guildMember.id) && !TextureRequest.requestMap.delete(guildMember.id)) {
            channel.send(`${guildMember.user.tag} 你沒有進行中的委託!`);
        } else {
            channel.send(`${guildMember.user.tag} 已成功刪除你目前的委託。`)
        }

    }

}
