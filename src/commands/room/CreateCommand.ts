import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import ChannelManager from "../../managers/ChannelManager";

export default class CreateCommand extends CommandNode {

    constructor(parent: CommandNode) {
        super(parent, "create", BotUtils.getCommandChannels(), BotUtils.getRoles(), "新增房間", []);
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        if (ChannelManager.isUsing(guildMember.user)) {
            await channel.send(`${guildMember.user.tag}  你已經擁有房間了。`);
            return;
        }

        if (ChannelManager.containPlayer(guildMember)) {
            await channel.send(`${guildMember.user.tag}  你目前加入了別人房間。請先請求退出後再嘗試。`);
            return;
        }
        await ChannelManager.addChannel(guildMember)
        await channel.send("成功創建了 ".concat(guildMember.user.tag).concat(" 的房間。"));
    }

}
