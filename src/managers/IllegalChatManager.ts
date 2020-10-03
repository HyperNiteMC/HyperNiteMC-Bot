import {Guild, GuildMember, Message} from "discord.js";
import chat from '../secret/chat.json';
import BotUtils from "../utils/BotUtils";
import id from '../secret/id.json'

const isIllegal = async (m: Message): Promise<boolean> => {
    const guild: Guild = BotUtils.getGuild();
    const member: GuildMember = await guild.members.fetch({user: m.author, cache: true});
    if (member.roles.highest.comparePositionTo(guild.roles.cache.get(id.admin)) > -1) return false; // the role over bot will ignore it
    const msg = m.content;
    if (chat.illegal.some(s => msg.toLowerCase().includes(s.toLowerCase()))) return true;
    const regex = /^(https*:\/\/)(?<domain>.+)/gmi;
    const rec = regex.exec(msg);
    if (rec != null) {
        if (chat.website.every(s => !rec.groups.domain.includes(s.toLowerCase()))) return true;
    }
    return false;
};


export default isIllegal;
