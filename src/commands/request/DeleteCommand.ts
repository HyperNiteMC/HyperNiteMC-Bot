import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import {delRequest} from "../../managers/request/RequestedManager";

export default class DeleteCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "delete", BotUtils.findChannels(TextChannel, '586539557789368340'), BotUtils.getRoles(), `刪除目前委託`, [], "resolve");
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        delRequest(guildMember.id).then(b => {
            const msg: string = b ? `已成功刪除你目前的委託。` : `你沒有進行中的委託!`;
            channel.send(`${guildMember.user.tag} ${msg}`)
        })


    }

}
