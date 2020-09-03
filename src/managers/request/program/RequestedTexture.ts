import {Requested, RequestState} from "../RequestTypes";
import {Message, RichEmbed, TextChannel, User} from "discord.js";
import * as id from "../../../secret/id.json"
import BotUtils from "../../../utils/BotUtils";
import {Requester} from "../../../entity/Entites";

enum State {
    TEXTURE_NAME,
    TEXTURE_TYPE,
    ORIGINAL_PNG,
    SERVER_VERSION,
    OTHERS,
}

export default class RequestedTexture implements Requested {

    constructor() {
        this._state = State.TEXTURE_NAME;
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

    private _message: Message;

    get message(): Message {
        return this._message;
    }

    async sendChannel(user: User) {
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
        this._message = await (BotUtils.getGuild().channels.get(id.textureRequestBroadcast) as TextChannel).send(embed) as Message;
        const requester = new Requester()
        requester.userId = user.id
        requester.msgId = this._message.id
        await requester.save()
        return user.send(`你的訊息已成功發佈。`);
    }

    public async handleMessage(user: User, message: Message): Promise<boolean> {
        switch (this._state) {
            case State.TEXTURE_NAME:
                this._name = message.content;
                await message.reply(`請輸入材質類型: `);
                this._state = State.TEXTURE_TYPE;
                break;
            case State.TEXTURE_TYPE:
                this._type = message.content;
                await message.reply(`請輸入材質適用伺服器版本: `);
                this._state = State.SERVER_VERSION;
                break;
            case State.SERVER_VERSION:
                this._version = message.content;
                await message.reply(`請貼上原圖片連結: `);
                this._state = State.ORIGINAL_PNG;
                break;
            case State.ORIGINAL_PNG:
                if (!message.content.startsWith('http') || (!message.content.endsWith('.png') && !message.content.endsWith('.jpg'))) {
                    await message.reply(`不是有效的圖片連結!`);
                    return false;
                }
                this._pngUrl = message.content;
                await message.reply(`請輸入其他備註: (:x: 可漏空)`);
                this._state = State.OTHERS;
                break;
            case State.OTHERS:
                this._others = message.content === '❌' ? '' : message.content;
                await message.reply(`材質委託內容填入完成，正在生成訊息到委託頻道...`);
                this._state = RequestState.FINISH;
                await this.sendChannel(message.author);
                return true;
            default:
                break;
        }
        return false;
    }

}
