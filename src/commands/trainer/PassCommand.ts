import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";

export default class PassCommand extends CommandNode {

    constructor(parent: CommandNode) {
        super(parent, "pass", BotUtils.findChannels(TextChannel, '606838968398381098', '444038682366705664'), BotUtils.findRole('606838578789482506'), "通過指令", ["<是否為見習>", "<texture | plugin | builder>", "<玩家tag>"]);
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        const intern: boolean = args[0].startsWith("true") || args[0].startsWith("yes");
        const job: string = args[1];
        let jobId: string;
        switch (job) {
            case 'texture':
                jobId = '567264521480306688';
                break;
            case 'plugin':
                jobId = '567264396653363200';
                break;
            case 'builder':
                jobId = '567264684605177856';
                break;
            default:
                channel.send(`${guildMember.user.tag} 找不到你要的類型，有效類型如下`);
                channel.send(this.placeholders[1].toString());
                return;
        }
        const mem: GuildMember = BotUtils.getGuild().members.get(args[2].startsWith('@') ? args[2].substr(1) : args[2]);
        if (mem == undefined) {
            channel.send(guildMember.user.tag + " 找不到對象。");
            return;
        } else if (mem.id === guildMember.id) {
            channel.send(guildMember.user.tag + " 對象無法為自己!");
            return;
        } else if (mem.roles.get('444038771042942987') == undefined) {
            channel.send(guildMember.user.tag + " 該對象不是考核/面試對象。");
            return;
        }

        const run = async (): Promise<void> => {
            await Promise.all([mem.addRole(intern ? '554215880616050691' : '313611459957358592'), mem.addRole(jobId)]);
            await mem.removeRole('444038771042942987');
        };

        run().then(() => {
            mem.send(`恭喜你成為 HyperNiteMC 的成員之一！`);
            channel.send(`${guildMember.user.tag} 你成功新增 ${mem.displayName} 為本服成員。`);
        }).catch(r => console.error((r as Error).message))
    }

}
