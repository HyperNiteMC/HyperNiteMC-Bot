import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import {delRequest} from "../../managers/request/RequestedManager";
import RequestCommand from "./RequestCommand";

export default class DeleteCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "delete", BotUtils.findChannels(TextChannel, RequestCommand.channelId), BotUtils.getRoles(), `刪除目前委託`, [], "resolve");
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        const b = await delRequest(guildMember.id)
        const msg: string = b ? `已成功刪除你目前的委託。` : `你沒有進行中的委託!`;
        return await channel.send(`${guildMember.user.tag} ${msg}`)
    }

}
