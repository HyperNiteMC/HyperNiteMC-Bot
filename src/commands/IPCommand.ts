import CommandNode from "../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../utils/BotUtils";

export default class IPCommand extends CommandNode {

    constructor() {
        super(null, "ip", BotUtils.getChannels(), BotUtils.getRoles(), "獲取伺服器 IP", []);
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        channel.send(`目前僅限內部人員進入, 詳情請留意 ${BotUtils.getGuild().channels.get('586556883473661982').name}`);
    }

}
