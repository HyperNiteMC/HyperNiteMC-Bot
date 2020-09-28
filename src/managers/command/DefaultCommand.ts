import CommandNode from "./CommandNode";
import * as Discord from "discord.js";
import {GuildMember, Role, TextChannel} from "discord.js";
import {version} from "../../index"
import HelpListBuilder from "./HelpListBuilder";

abstract class DefaultCommand extends CommandNode {


    abstract sendUser?: boolean = false;

    protected constructor(parent: CommandNode, command: string, allowChannels: Set<TextChannel>, allowRoles: Set<Role>, description: string, ...alias: string[]) {
        super(parent, command, allowChannels, allowRoles, description, [], ...alias);
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        const builder: HelpListBuilder = new HelpListBuilder(this);
        if (this.subCommands.size == 0) {
            await channel.send("你無可用指令。");
            return;
        }
        for (let subCommand of this.subCommands) {
            if (!subCommand.matchRole(guildMember)) continue;
            builder.append(subCommand);
        }
        const help2: string[] = builder.helps;
        const richembed = new Discord.RichEmbed({
            author: {
                name: `HyperNiteMC Discord Bot`,
                url: 'https://github.com/eric2788'
            },
            timestamp: new Date(),
            fields: [{
                name: help2.shift(),
                value: help2.join('\n')
            }],
            footer: {
                text: `HyperNiteMC 專用 bot 版本 ${version}`
            }

        });
        (this.sendUser ? guildMember.send(richembed) : channel.send(richembed)).catch(r => console.error((r as Error)));
    }

}

export default DefaultCommand;
