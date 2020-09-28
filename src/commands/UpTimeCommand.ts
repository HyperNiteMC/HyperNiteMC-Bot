import CommandNode from "../managers/command/CommandNode";
import {GuildMember, RichEmbed, TextChannel} from "discord.js";
import BotUtils from "../utils/BotUtils";
import moment, {Moment} from "moment";
import id from "../secret/id.json";

export default class UpTimeCommand extends CommandNode {

    constructor() {
        super(null, "uptime", BotUtils.getChannels(), BotUtils.getRoles(), "查看 Bot 上次啟動時間", [], "lastlaunch");
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        const launch: Date = BotUtils.getActivateTime();
        const launchMoment: Moment = moment(launch);
        const rich: RichEmbed = new RichEmbed({
            fields: [
                {
                    name: '此 Bot 上次啟動時間',
                    value: launch.toLocaleString('zh-TW', {timeZone: 'Asia/Hong_Kong'}),
                },
                {
                    name: '現今距離上次啟動時間',
                    value: launchMoment.fromNow()
                }
            ],
            footer: {
                text: `HyperNiteMC 專用 bot 版本 ${id.botVersion}`
            }
        });
        await channel.send(rich)
    }
}


