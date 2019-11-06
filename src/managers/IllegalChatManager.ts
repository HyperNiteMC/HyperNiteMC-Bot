import {Message} from "discord.js";
import * as chat from '../secret/chat.json';

const isIllegal = async (m: Message): Promise<boolean> => {
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
