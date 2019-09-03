import {DMChannel, GuildMember, Message, RichEmbed, Snowflake, TextChannel, User} from "discord.js";
import BotUtils from "../../../utils/BotUtils";
import {Requested, RequestState} from "../request";

export enum State {
    PLUGIN_NAME,
    PLUGIN_DESCRIPTION,
    PLUGIN_FEATURES,
    SERVER_VERSION,
    COMMAND,
    PERMISSION,
    OTHERS
}

export const requestMap: Map<Snowflake, RequestedPlugin> = new Map<Snowflake, RequestedPlugin>();

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

const startPluginRequest = (mem: GuildMember): void => {
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
    })).then(() => mem.send(`請輸入插件名稱: `));
    requestMap.set(mem.id, new RequestedPlugin(State.PLUGIN_NAME));
};

export default startPluginRequest;

export class RequestedPlugin implements Requested {
    constructor(state: State) {
        this._state = state;
    }

    private _name: string;

    set name(value: string) {
        this._name = value;
    }

    private _description: string;

    set description(value: string) {
        this._description = value;
    }

    private _features: string;

    set features(value: string) {
        this._features = value;
    }

    private _version: string;

    set version(value: string) {
        this._version = value;
    }

    private _commands: string;

    set commands(value: string) {
        this._commands = value;
    }

    private _permission: string;

    set permission(value: string) {
        this._permission = value;
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
            title: `${user.tag} 的插件委託`,
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
                    name: `插件名稱`,
                    value: this._name
                },
                {
                    name: `插件功能`,
                    value: this._features
                },
                {
                    name: `插件詳細內容`,
                    value: this._description
                },
                {
                    name: `伺服器版本`,
                    value: this._version
                },
                {
                    name: `指令`,
                    value: this._commands
                },
                {
                    name: `權限`,
                    value: this._permission
                },
                {
                    name: `其他備註`,
                    value: !!this._others ? this._others : `無`
                }
            ],
            footer: {
                text: `若插件師們有興趣，歡迎輸入 !request accept plugin ${user.tag} 指令來接受委託`,
            },
        });
        this._message = await (BotUtils.getGuild().channels.get('618400534377922570') as TextChannel).send(embed);
        return user.send(`你的訊息已成功發佈。`);
    }
}


export const msgListener = (message: Message) => {
    if (!requestMap.has(message.author.id)) return;
    if (!(message.channel instanceof DMChannel)) return;
    const plugin: RequestedPlugin = requestMap.get(message.author.id);
    if (message.content === 'exit') {
        message.reply(`已退出委託新增。`).then(() => requestMap.delete(message.author.id));
        return;
    }
    handleMessage(plugin, message).catch(reason => console.error((reason as Error).message));
};

const handleMessage = async (plugin: RequestedPlugin, message: Message) => {
    switch (plugin.state) {
        case State.PLUGIN_NAME:
            plugin.name = message.content;
            await message.reply(`請輸入插件適用伺服器版本: `);
            plugin.state = State.SERVER_VERSION;
            break;
        case State.SERVER_VERSION:
            plugin.version = message.content;
            await message.reply(`請輸入插件功能內容: `);
            plugin.state = State.PLUGIN_FEATURES;
            break;
        case State.PLUGIN_FEATURES:
            plugin.features = message.content;
            await message.reply(`請輸入插件詳細內容: `);
            plugin.state = State.PLUGIN_DESCRIPTION;
            break;
        case State.PLUGIN_DESCRIPTION:
            plugin.description = message.content;
            await message.reply(`請輸入詳細指令內容: `);
            plugin.state = State.COMMAND;
            break;
        case State.COMMAND:
            plugin.commands = message.content;
            await message.reply(`請輸入詳細權限內容: `);
            plugin.state = State.PERMISSION;
            break;
        case State.PERMISSION:
            plugin.permission = message.content;
            await message.reply(`請輸入其他備註: (:x: 可漏空)`);
            plugin.state = State.OTHERS;
            break;
        case State.OTHERS:
            plugin.others = message.content === '❌' ? '' : message.content;
            await message.reply(`插件委託內容填入完成，正在生成訊息到委託頻道...`);
            plugin.state = RequestState.FINISH;
            plugin.sendChannel(message.author);
            break;
        default:
            break;
    }
};

