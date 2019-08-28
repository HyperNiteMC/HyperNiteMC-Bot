import CommandNode from "../managers/command/CommandNode";
import {GuildMember, RichEmbed, TextChannel} from "discord.js";
import BotUtils from "../utils/BotUtils";
import moment, {Moment} from "moment";

export default class UpTimeCommand extends CommandNode {

    constructor() {
        super(null, "uptime", BotUtils.getChannels(), BotUtils.getRoles(), "查看 Bot 上次啟動時間", [], "lastlaunch");
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        const launch: Date = BotUtils.getActivateTime();
        const launchMoment: Moment = moment(launch);
        const rich: RichEmbed = new RichEmbed({
            fields: [
                {
                    name: '此 Bot 上次啟動時間',
                    value: launch.toLocaleString('zh-TW'),
                },
                {
                    name: '現今距離上次啟動時間',
                    value: launchMoment.fromNow()
                }
            ],
        });
        channel.send(rich).catch(r => console.error((r as Error).message));
    }
}


