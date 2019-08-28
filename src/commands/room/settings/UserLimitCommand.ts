import CommandNode from "../../../managers/command/CommandNode";
import {GuildMember, TextChannel, VoiceChannel} from "discord.js";
import BotUtils from "../../../utils/BotUtils";
import ChannelManager from "../../../managers/ChannelManager";

export default class UserLimitCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "limit", BotUtils.getCommandChannels(), BotUtils.findRole('554215880616050691'), "設置人數限制", ["<value>"], "userlimit");
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        const value: number = parseInt(args[0]);
        if (isNaN(value)) {
            channel.send(guildMember.user.tag.concat(" 無效的數值!"));
            return;
        }
        if (!ChannelManager.isUsing(guildMember.user)) {
            channel.send(guildMember.user.tag + " 你沒有創建過房間。");
            return;
        }
        ChannelManager.getChannel<VoiceChannel>(guildMember.user, 'voice').setUserLimit(value).then(() => {
            channel.send("成功設置 ".concat(guildMember.user.tag).concat(" 的語音頻道人數為 " + value))
        });
    }

}
