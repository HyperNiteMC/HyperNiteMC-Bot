import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import {isRequesting, startRequest} from "../../managers/request/RequestedManager";
import RequestCommand from "./RequestCommand";

export default class CreateCommand extends CommandNode {

    constructor(parent: CommandNode) {
        super(parent, "create", BotUtils.findChannels(TextChannel, RequestCommand.channelId), BotUtils.getRoles(), "新增委託", ['<plugin | texture>'], "add", "new");
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        if (await isRequesting(guildMember)) {
            channel.send(`${guildMember.user.tag} 你目前已有一個進行中的委託，請先 透過 !request delete 刪除上一個委託再嘗試!`);
            return;
        }

        let promise: Promise<void>;
        switch (args[0]) {
            case "plugin":
                promise = startRequest(guildMember, 'plugin');
                break;
            case "texture":
                promise = startRequest(guildMember, 'texture');
                break;
            default:
                channel.send(`${guildMember.user.tag} 無效的委託類型!`);
                break;
        }

        promise.catch(r => console.error((r as Error).message));
    }

}
