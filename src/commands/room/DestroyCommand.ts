import CommandNode from "../../managers/command/CommandNode";
import {GuildChannel, GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import ChannelManager from "../../managers/ChannelManager";

export default class DestroyCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "destroy", BotUtils.getCommandChannels(), BotUtils.getRoles(), "刪除房間", [], "disable");
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        if (!ChannelManager.isUsing(guildMember.user)) {
            await channel.send(`${guildMember.user.tag}  你沒有創建過房間。`);
            return;
        }
        const promies: Promise<GuildChannel>[] = ChannelManager.delChannel(guildMember.user);
        const g = Promise.all(promies)
        console.log(guildMember.user.tag + " 的頻道已刪除: ".concat(g[0].name).concat(" & ").concat(g[1].name));
        await channel.send("成功刪除了 ".concat(guildMember.user.tag).concat(" 的房間。"))
    }


}
