import {Requested, RequestState} from "../RequestTypes";
import {Message, RichEmbed, TextChannel, User} from "discord.js";
import BotUtils from "../../../utils/BotUtils";
import * as id from "../../../secret/id.json";
import {Requester} from "../../../entity/Entites";

enum State {
    PLUGIN_NAME,
    PLUGIN_DESCRIPTION,
    PLUGIN_FEATURES,
    SERVER_VERSION,
    COMMAND,
    PERMISSION,
    OTHERS
}

export default class RequestedPlugin implements Requested {
    constructor() {
        this._state = State.PLUGIN_NAME;
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

    private _message: Message;

    get message(): Message {
        return this._message;
    }

    async sendChannel(user: User) {
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
        this._message = await (BotUtils.getGuild().channels.get(id.pluginRequestBroadcast) as TextChannel).send(embed) as Message;
        let requester = new Requester();
        requester.userId = user.id;
        requester.msgId = this._message.id;
        await requester.save();
        return user.send(`你的訊息已成功發佈。`);
    }

    public async handleMessage(user: User, message: Message): Promise<boolean> {
        switch (this._state) {
            case State.PLUGIN_NAME:
                this._name = message.content;
                await message.reply(`請輸入插件適用伺服器版本: `);
                this._state = State.SERVER_VERSION;
                break;
            case State.SERVER_VERSION:
                this._version = message.content;
                await message.reply(`請輸入插件功能內容: `);
                this._state = State.PLUGIN_FEATURES;
                break;
            case State.PLUGIN_FEATURES:
                this._features = message.content;
                await message.reply(`請輸入插件詳細內容: `);
                this._state = State.PLUGIN_DESCRIPTION;
                break;
            case State.PLUGIN_DESCRIPTION:
                this._description = message.content;
                await message.reply(`請輸入詳細指令內容: `);
                this._state = State.COMMAND;
                break;
            case State.COMMAND:
                this._commands = message.content;
                await message.reply(`請輸入詳細權限內容: `);
                this._state = State.PERMISSION;
                break;
            case State.PERMISSION:
                this._permission = message.content;
                await message.reply(`請輸入其他備註: (:x: 可漏空)`);
                this._state = State.OTHERS;
                break;
            case State.OTHERS:
                this._others = message.content === '❌' ? '' : message.content;
                await message.reply(`插件委託內容填入完成，正在生成訊息到委託頻道...`);
                this._state = RequestState.FINISH;
                await this.sendChannel(message.author);
                return true;
            default:
                break;
        }
        return false;
    }
}
