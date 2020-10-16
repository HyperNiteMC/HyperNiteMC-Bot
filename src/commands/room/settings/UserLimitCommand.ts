import CommandNode from "../../../managers/command/CommandNode";
import {GuildMember, TextChannel, VoiceChannel} from "discord.js";
import BotUtils from "../../../utils/BotUtils";
import ChannelManager from "../../../managers/ChannelManager";
import id from "../../../secret/id.json"

export default class UserLimitCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "limit", BotUtils.getCommandChannels(), BotUtils.findRole(id.roomManageRole), "設置人數限制", ["<value>"], "userlimit");
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        const value: number = parseInt(args[0]);
        if (isNaN(value)) {
            await channel.send(guildMember.user.tag.concat(" 無效的數值!"));
            return;
        }
        if (!ChannelManager.isUsing(guildMember.user)) {
            await channel.send(`${guildMember.user.tag}  你沒有創建過房間。`);
            return;
        }
        await ChannelManager.getChannel<VoiceChannel>(guildMember.user, 'voice').setUserLimit(value)
        await channel.send("成功設置 ".concat(guildMember.user.tag).concat(" 的語音頻道人數為 " + value))
    }

}
