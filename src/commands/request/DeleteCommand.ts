import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, Snowflake, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import * as PluginRequest from "./program/PluginRequestProgram";
import * as TextureRequest from "./program/TextureRequestProgram";

export default class DeleteCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "delete", BotUtils.findChannels(TextChannel, '586539557789368340'), BotUtils.getRoles(), `刪除目前委託`, [], "resolve");
    }

    private static async delete(id: Snowflake): Promise<boolean> {
        const bool: boolean[] = await Promise.all([PluginRequest.delRequest(id), TextureRequest.delRequest(id)]);
        return bool[0] || bool[1];
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        DeleteCommand.delete(guildMember.id).then(b => {
            const msg: string = b ? `已成功刪除你目前的委託。` : `你沒有進行中的委託!`;
            channel.send(`${guildMember.user.tag} ${msg}`)
        })


    }

}
