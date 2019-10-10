import CommandNode from "../managers/command/CommandNode";
import {GuildMember, Message, RichEmbed, TextChannel} from "discord.js";
import BotUtils from "../utils/BotUtils";

export default class BetaCommand extends CommandNode {

    constructor() {
        super(null, "beta", BotUtils.getCommandChannels(), BotUtils.getRoles(), "封測申請指令", []);
    }

    execute(channel: TextChannel, guildMember: GuildMember, args: string[]): void {
        if (guildMember.roles.has('618853616089825281')) {
            channel.send(`你已經是封測玩家了。`)
        } else {
            verify(guildMember).catch((err: Error) => {
                console.error(err);
                channel.send(`Error -> ${err.name}: ${err.message}`)
            });
        }
    }

}

const verify = async (mem: GuildMember) => {
    const embed: RichEmbed = new RichEmbed({
        color: 3447003,
        author: {
            name: '申請封測前注意事項。',
            icon_url: 'http://1stmotors.com/sites/default/files/indicatore/K02_0.png'
        },
        description: '__**在參與本次封測前，請先理解下列條文，以有更好的遊玩體驗。**__\n\n\n>>>',
        fields: [
            {
                name: '有關材質體驗',
                value: '幸得好心人幫助，本服可以在封測前完成了材質的實裝。但仍可能有瑕疵或不足，屆時你應用 #漏洞或問題回報 進行回報。',
            },
            {
                name: '有關遊戲體驗',
                value: '目前本服已經測試過遊戲的運作，並把諸多漏洞修復完成，但仍可能出現我們沒有遇到的漏洞，一旦發現漏洞，請到 #漏洞或問題回報 進行回報。',
            },
            {
                name: '有關遊戲建議',
                value: '我們不排除未來可能會來越來越忙而無暇顧及伺服器，因此建議並不會被大部分採納。但你仍可以發表你的建議。'
            },
            {
                name: '有關違規行為',
                value: '我們目前是裝了新的反作弊插件，但由於時間及沒有可靠的數據，此插件可能會出現誤判的現象。但我們已把反作弊插件調到不會進行踢出及封禁等動作。若有發現誤判，請及時到 #漏洞或問題回報 進行回報。',
            },
            {
                name: '有關本伺服器',
                value: '在封測階段期間，本服可能會出現經常重啟，甚至關閉一會兒的狀況，這是由於本服目前尚未完善的原因，因此純屬正常。若有不便，敬請原諒。'
            },
            {
                name: '有關問題回報',
                value: '若有任何疑問，歡迎你到 #漏洞或問題回報 詢問，讓本服工作人員或其他封測玩家都可以解答你的問題。\n\n\n>>>',
            },
            {
                name: '__若你已經了解過上述的條文, __',
                value: '現在請在十分鐘內加入 :white_check_mark: 反應到此訊息上, 之後你將被加入封測玩家身份組。\n 若果你仍未熟悉我們的伺服器，我們歡迎你先去看看下面我們[在2015年製作的短片](https://youtu.be/Y1jzLXRKYzY)。',
                inline: true
            }
        ],
        footer: {
            text: 'HyperNiteMC server',
        },
        timestamp: new Date()
    });

    const msg: Message = await mem.send(embed) as Message;
    await msg.react('✅');
    const col = await msg.awaitReactions((r, user) => user.id === mem.id && r.emoji.name === '✅', {
        time: 600 * 1000,
        maxEmojis: 1,
    });
    if (col.size) {
        await mem.addRole('618853616089825281', '成功申請成為封測玩家');
        const date: Date = new Date();
        const localString: string = date.toLocaleString('zh-TW', {timeZone: 'Asia/Hong_Kong'});
        await (BotUtils.getGuild().channels.get('619120537406537738') as TextChannel).send(`${mem.user.tag} 在 ${localString} 成為了封測玩家。`);
        mem.send(`你已成功申請成為封測玩家!`);
    } else {
        mem.send(`已逾時，請重新申請。`);
    }
};
