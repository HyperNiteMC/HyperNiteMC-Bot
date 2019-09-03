import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import startPluginRequest, {requestMap as pluginMap} from "./program/PluginRequestProgram";
import startTextureRequest, {requestMap as textureMap} from "./program/TextureRequestProgram";

export default class CreateCommand extends CommandNode {

    constructor(parent: CommandNode) {
        super(parent, "create", BotUtils.findChannels(TextChannel, '586539557789368340'), BotUtils.getRoles(), "新增委託", ['<plugin | texture>'], "add", "new");
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        if (pluginMap.has(guildMember.id) || textureMap.has(guildMember.id)) {
            channel.send(`${guildMember.user.tag} 你目前已有一個進行中的委託，請先 透過 !request delete 刪除上一個委託再嘗試!`);
            return;
        }
        switch (args[0]) {
            case "plugin":
                startPluginRequest(guildMember);
                break;
            case "texture":
                startTextureRequest(guildMember);
                break;
            default:
                channel.send(`${guildMember.user.tag} 無效的委託類型!`);
                break;
        }
    }

}
