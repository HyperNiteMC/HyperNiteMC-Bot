import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import ChannelManager from "../../managers/ChannelManager";

export default class DelPlayerCommand extends CommandNode {

    constructor(parent: CommandNode) {
        super(parent, "remove", BotUtils.getCommandChannels(), BotUtils.getRoles(), "從你的房間移除對象", ["<玩家tag>"], "delete");
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        const mem: GuildMember = BotUtils.getGuild().members.cache.get(args[0].startsWith('@') ? args[0].substr(1) : args[0]);
        if (mem == undefined) {
            await channel.send(`${guildMember.user.tag}  找不到對象。`);
            return;
        } else if (mem.id === guildMember.id) {
            await channel.send(`${guildMember.user.tag}  對象無法為自己!`);
            return;
        }
        if (!ChannelManager.contain(guildMember.user, mem)) {
            await channel.send(`${guildMember.user.tag}  你并沒有新增過該對象。`);
            return;
        }
        if (ChannelManager.delPlayer(guildMember.user, mem.user)) {
            await channel.send(`${guildMember.user.tag}  成功從你的房間移除該對象。`);
        } else {
            await channel.send(`${guildMember.user.tag}  你沒有創建過房間。`);
        }
    }

}
