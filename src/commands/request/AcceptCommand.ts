import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import ChannelManager from "../../managers/ChannelManager";
import {isFinish, isRequesting} from "../../managers/request/RequestedManager";

export default class AcceptCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "accept", BotUtils.findChannels(TextChannel, '586539557789368340'), BotUtils.findRole('554215880616050691'), "接受委託", [`<委託者 tag>`]);
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        const mem: GuildMember = BotUtils.getGuild().members.get(args[0].startsWith('@') ? args[0].substr(1) : args[0]);
        if (mem == undefined) {
            channel.send(`${guildMember.user.tag} 找不到對象。`);
            return;
        } else if (mem.id === guildMember.id) {
            channel.send(`${guildMember.user.tag} 對象無法為自己!`);
            return;
        }

        if (!isRequesting(mem)) {
            channel.send(`${guildMember.user.tag} 該對象目前并沒有請求任何委託。`);
            return;
        }

        if (!isFinish(mem)) {
            channel.send(`${guildMember.user.tag} 該對象的委託內容尚未完善。`);
            return;
        }

        handleAccept(mem, guildMember, channel).catch(r => console.error((r as Error).message));
    }
}

const handleAccept = async (requester: GuildMember, dev: GuildMember, channel: TextChannel) => {
    if (!ChannelManager.isUsing(requester.user)) await ChannelManager.addChannel(requester);
    ChannelManager.addPlayer(requester.user, dev.user);
    channel.send(`${dev.user.tag} 成功接受 ${requester.user.tag} 的委託。`);
    const chan: TextChannel = ChannelManager.getChannel<TextChannel>(requester.user, 'text');
    chan.send(`${dev.user.tag} 接受了你的委託并進入了你的房間。`);
};
