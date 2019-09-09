import CommandNode from "./CommandNode";
import {Message, RichEmbed, TextChannel, User} from "discord.js";
import BotUtils from "../../utils/BotUtils";

const registerNodes: Set<CommandNode> = new Set<CommandNode>();

const register = (node: CommandNode) => {
    if ([...registerNodes].find(n => n.command === node.command) != undefined) {
        console.warn(`You have registered a same command with '!${node.command}', skipped`);
        return;
    }
    registerNodes.add(node);
};

const remove = (node: CommandNode) => {
    registerNodes.delete(node);
};

const help = (user: User): void => {
    const helpmsg: string[] = [...registerNodes].map(node => `!${node.command} - ${node.description}`);
    user.send(new RichEmbed({
        fields: [{
            name: '可用指令： ',
            value: helpmsg.join('\n'),
        }],
        author: {
            name: `HyperNiteMC Discord Bot`,
            url: 'https://github.com/eric2788'
        },
        footer: {
            text: `HyperNiteMC 專用 bot`
        }
    }))
};

const invoke = (msg: Message): boolean => {
    if (msg.content.startsWith("!help")) {
        help(msg.author);
        return true;
    }
    if (msg.author.bot) return false;
    if (!msg.content.startsWith("!")) return false;
    const [label, ...args] = msg.content.split(" ");
    const command: string = label.substr(1);
    for (let node of registerNodes.values()) {
        if (node.match(command)) {
            if (!(msg.channel instanceof TextChannel)) return false;
            const channel: TextChannel = msg.channel as TextChannel;
            BotUtils.getGuild().fetchMember(msg.member).then(mem => {
                node.invokeCommand(args, channel, mem);
            }).catch(r => console.warn((r as Error).message));
            return true;
        }
    }
    return false;
};

const Manager = {
    register,
    remove,
    invoke
};

export default Manager;
