import {DMChannel, GuildMember, Message, RichEmbed, Snowflake, TextChannel, User} from "discord.js";
import BotUtils from "../../../utils/BotUtils";
import {Requested, RequestState} from "../request";

export enum State {
    TEXTURE_NAME,
    TEXTURE_TYPE,
    ORIGINAL_PNG,
    SERVER_VERSION,
    OTHERS,
}

export const requestMap: Map<Snowflake, RequestedTexture> = new Map<Snowflake, RequestedTexture>();

export const delRequest = async (id: Snowflake): Promise<boolean> => {
    if (!requestMap.has(id)) return false;
    const msg: Message | Message[] = requestMap.get(id).message;
    if (msg instanceof Message) {
        await msg.delete(0)
    } else {
        msg.forEach((async m => await m.delete()));
    }
    return requestMap.delete(id);
};

const startTextureRequest = (mem: GuildMember): void => {
    mem.send(new RichEmbed({
        fields: [
            {
                name: "注意事項",
                value: "每則問題請使用一則訊息一次過發送，否則系統將直接跳過下一個問題。"
            },
            {
                name: '退出',
                value: "欲退出委託新增，請輸入 **exit**"
            }
        ]
    })).then(() => mem.send(`請輸入材質名稱: `));
    requestMap.set(mem.id, new RequestedTexture(State.TEXTURE_NAME));
};

export default startTextureRequest;

export class RequestedTexture implements Requested {
    constructor(state: State) {
        this._state = state;
    }

    private _name: string;

    set name(value: string) {
        this._name = value;
    }

    private _type: string;

    set type(value: string) {
        this._type = value;
    }

    private _pngUrl: string;

    set pngUrl(value: string) {
        this._pngUrl = value;
    }

    private _version: string;

    set version(value: string) {
        this._version = value;
    }

    private _others: string;

    set others(value: string) {
        this._others = value;
    }

    private _state: State | RequestState;

    get state(): State | RequestState {
        return this._state;
    }

    set state(value: State | RequestState) {
        this._state = value;
    }

    private _message: Message | Message[];

    get message(): Message | Message[] {
        return this._message;
    }

    public async sendChannel(user: User) {
        const embed: RichEmbed = new RichEmbed({
            title: `${user.tag} 的材質委託`,
            timestamp: new Date(),
            author: {
                name: user.tag,
                icon_url: user.avatarURL
            },
            fields: [
                {
                    name: `委託人`,
                    value: user.tag
                },
                {
                    name: `材質名稱`,
                    value: this._name
                },
                {
                    name: `材質類型`,
                    value: this._type
                },
                {
                    name: `伺服器版本`,
                    value: this._version
                },
                {
                    name: `其他備註`,
                    value: !!this._others ? this._others : `無`
                }
            ],
            image: {
                url: this._pngUrl,
                proxy_url: this._pngUrl
            },
            footer: {
                text: `若材質設計師們有興趣，歡迎輸入 !request accept texture ${user.tag} 指令來接受委託`,
            },
        });
        this._message = await (BotUtils.getGuild().channels.get('618400708445732864') as TextChannel).send(embed);
        return user.send(`你的訊息已成功發佈。`);
    }
}


export const msgListener = (message: Message) => {
    if (!requestMap.has(message.author.id)) return;
    if (!(message.channel instanceof DMChannel)) return;
    const texture: RequestedTexture = requestMap.get(message.author.id);
    if (message.content === 'exit') {
        message.reply(`已退出委託新增。`).then(() => requestMap.delete(message.author.id));
        return;
    }
    handleMessage(texture, message).catch(reason => console.error((reason as Error).message));
};

const handleMessage = async (plugin: RequestedTexture, message: Message) => {
    switch (plugin.state) {
        case State.TEXTURE_NAME:
            plugin.name = message.content;
            await message.reply(`請輸入材質類型: `);
            plugin.state = State.TEXTURE_TYPE;
            break;
        case State.TEXTURE_TYPE:
            plugin.type = message.content;
            await message.reply(`請輸入材質適用伺服器版本: `);
            plugin.state = State.SERVER_VERSION;
            break;
        case State.SERVER_VERSION:
            plugin.version = message.content;
            await message.reply(`請貼上原圖片連結: `);
            plugin.state = State.ORIGINAL_PNG;
            break;
        case State.ORIGINAL_PNG:
            if (!message.content.startsWith('http') || (!message.content.endsWith('.png') && !message.content.endsWith('.jpg'))) {
                return message.reply(`不是有效的圖片連結!`);
            }
            plugin.pngUrl = message.content;
            await message.reply(`請輸入其他備註: (:x: 可漏空)`);
            plugin.state = State.OTHERS;
            break;
        case State.OTHERS:
            plugin.others = message.content === '❌' ? '' : message.content;
            await message.reply(`材質委託內容填入完成，正在生成訊息到委託頻道...`);
            plugin.state = RequestState.FINISH;
            plugin.sendChannel(message.author);
            break;
        default:
            break;
    }
};

