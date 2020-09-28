import {DMChannel, GuildMember, Message, RichEmbed, Snowflake, TextChannel} from "discord.js";
import {Requester} from "../../entity/Entites";
import BotUtils from "../../utils/BotUtils";
import * as id from "../../secret/id.json"
import RequestedPlugin from "./program/RequestedPlugin";
import {Requested, RequestState} from "./RequestTypes";
import {version} from "../../index"
import RequestedTexture from "./program/RequestedTexture";


export const delRequest = async (id: Snowflake) => {
    const requester: Requester = await Requester.findOne({userId: id});
    if (requester === undefined) return false;
    await delRequestMessage(requester.msgId);
    return requester.remove();
};

const requestMap: Map<Snowflake, Requested> = new Map<Snowflake, Requested>();

export const isRequesting = async (mem: GuildMember) => {
    const buildingRequest: boolean = requestMap.has(mem.id);
    const requesting: boolean = await Requester.findOne({userId: mem.id}) !== undefined;
    return buildingRequest || requesting;
};

export const isFinish = async (mem: GuildMember) => {
    if (!requestMap.has(mem.id)) return true;
    return requestMap.get(mem.id).state == RequestState.FINISH
};

export const handleMessage = async (message: Message) => {
    if (!requestMap.has(message.author.id)) return;
    if (!(message.channel instanceof DMChannel)) return;
    if (message.content === 'exit') {
        message.reply(`已退出委託新增。`).then(() => requestMap.delete(message.author.id));
        return;
    }
    const result: boolean = await requestMap.get(message.author.id).handleMessage(message.author, message);
    if (result) requestMap.delete(message.author.id);
};

export const startRequest = async (mem: GuildMember, type: 'texture' | 'plugin') => {
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
        ],
        footer: {
            text: `HyperNiteMC 專用 bot 版本 ${version}`
        }
    })).then(() => mem.send(`請輸入${type === 'plugin' ? '插件' : '材質'}名稱: `));
    requestMap.set(mem.id, type === 'plugin' ? new RequestedPlugin() : new RequestedTexture());
};

const delRequestMessage = (msgId: Snowflake) => {
    const promises = [];
    [...BotUtils.findChannels<TextChannel>(TextChannel, id.pluginRequestBroadcast, id.textureRequestBroadcast)].map(channel => channel.messages).forEach(m => {
        const msg: Message = m.get(msgId);
        if (msg != null) promises.push(msg.delete(0))
    });
    return Promise.all(promises);
};
