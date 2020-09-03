import CommandNode from "../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../utils/BotUtils";
import info from '../secret/ip.json';

export default class IPCommand extends CommandNode {

    constructor() {
        super(null, "ip", BotUtils.getChannels(), BotUtils.getRoles(), "獲取伺服器 IP", []);
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        await channel.send(info.ip.replace(`<tag>`, `${BotUtils.getGuild().channels.get('586556883473661982').name}`));
    }

}
