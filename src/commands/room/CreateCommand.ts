import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import ChannelManager from "../../managers/ChannelManager";

export default class CreateCommand extends CommandNode {

    constructor(parent: CommandNode) {
        super(parent, "create", BotUtils.getCommandChannels(), BotUtils.getRoles(), "新增房間", []);
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        if (ChannelManager.isUsing(guildMember.user)) {
            channel.send(`${guildMember.user.tag}  你已經擁有房間了。`);
            return;
        }

        if (ChannelManager.containPlayer(guildMember)) {
            channel.send(`${guildMember.user.tag}  你目前加入了別人房間。請先請求退出後再嘗試。`);
            return;
        }
        ChannelManager.addChannel(guildMember).then(() => {
            channel.send("成功創建了 ".concat(guildMember.user.tag).concat(" 的房間。"));
        }).catch(r => console.log((r as Error).message));
    }

}
