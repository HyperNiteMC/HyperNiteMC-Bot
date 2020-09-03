import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import ChannelManager from "../../managers/ChannelManager";
import {isFinish, isRequesting} from "../../managers/request/RequestedManager";
import RequestCommand from "./RequestCommand";

export default class AcceptCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "accept", BotUtils.findChannels(TextChannel, RequestCommand.channelId), BotUtils.findRole('313611459957358592'), "接受委託", [`<委託者 tag>`]);
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        const mem: GuildMember = channel.guild.members.get(args[0].startsWith('@') ? args[0].substr(1) : args[0]);
        if (mem === undefined) {
            await channel.send(`${guildMember.user.tag} 找不到對象。`);
            return;
        } else if (mem.id === guildMember.id) {
            await channel.send(`${guildMember.user.tag} 對象無法為自己!`);
            return;
        }
        handleAccept(mem, guildMember, channel).catch(r => console.error((r as Error).message));
    }
}


const handleAccept = async (requester: GuildMember, dev: GuildMember, channel: TextChannel) => {
    if (!await isRequesting(requester)) {
        await channel.send(`${requester.user.tag} 該對象目前并沒有請求任何委託。`);
        return;
    }

    if (!await isFinish(requester)) {
        await channel.send(`${requester.user.tag} 該對象的委託內容尚未完善。`);
        return;
    }

    if (ChannelManager.contain(requester.user, dev)) {
        await channel.send(`${dev.user.tag} 你已經進入了他的房間了。`);
        return;
    }

    if (!ChannelManager.isUsing(requester.user)) await ChannelManager.addChannel(requester);
    ChannelManager.addPlayer(requester.user, dev.user);
    await channel.send(`${dev.user.tag} 成功接受 ${requester.user.tag} 的委託。`);
    const chan: TextChannel = ChannelManager.getChannel<TextChannel>(requester.user, 'text');
    await chan.send(`${dev.user.tag} 接受了你的委託并進入了你的房間。`);
};
