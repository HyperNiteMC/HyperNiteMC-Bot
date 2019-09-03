import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, Snowflake, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import * as PluginRequest from './program/PluginRequestProgram';
import {RequestedPlugin} from './program/PluginRequestProgram';
import * as TextureRequest from './program/TextureRequestProgram';
import {RequestedTexture} from './program/TextureRequestProgram';
import ChannelManager from "../../managers/ChannelManager";
import * as Req from './request'
import Requested = Req.Requested;
import RequestState = Req.RequestState;

export default class AcceptCommand extends CommandNode {


    constructor(parent: CommandNode) {
        super(parent, "accept", BotUtils.findChannels(TextChannel, '586539557789368340', '586550731142725642'), BotUtils.findRole('554215880616050691'), "接受委託", ['<plugin | texture>', `<委託者 tag>`]);
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        let map: Map<Snowflake, RequestedPlugin | RequestedTexture>;

        switch (args[0]) {
            case 'plugin':
                map = PluginRequest.requestMap;
                break;
            case 'texture':
                map = TextureRequest.requestMap;
                break;
            default:
                channel.send(`${guildMember.user.tag} 無效的委託類型!`);
                return;
        }

        const mem: GuildMember = BotUtils.getGuild().members.get(args[1].startsWith('@') ? args[1].substr(1) : args[1]);
        if (mem == undefined) {
            channel.send(`${guildMember.user.tag} 找不到對象。`);
            return;
        } else if (mem.id === guildMember.id) {
            channel.send(`${guildMember.user.tag} 對象無法為自己!`);
            return;
        }

        if (!map.has(mem.id)) {
            channel.send(`${guildMember.user.tag} 該對象目前并沒有請求此類型的委託。`);
            return;
        }

        const req: Requested = map.get(mem.id);

        if (req.state != RequestState.FINISH) {
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
