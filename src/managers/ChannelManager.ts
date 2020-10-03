import id from "../secret/id.json"
import {
    CategoryChannel,
    Channel,
    Collection,
    Guild,
    GuildChannel,
    GuildMember,
    Message,
    Snowflake,
    TextChannel,
    User,
    VoiceChannel
} from "discord.js";
import BotUtils from "../utils/BotUtils";
import moment from "moment";

const getChannel = <T extends GuildChannel>(user: User, type: 'text' | 'voice'): T => {
    return BotUtils.getGuild().channels.cache.find(g => g.name.startsWith(user.id) && g.type == type) as T;
};

const delChannel = (user: User): Promise<Channel>[] => {
    return BotUtils.getGuild().channels.cache.filter(g => g.name.startsWith(user.id)).map(g => g.delete("User Delete"));
};

const idleChannel = async (user: GuildMember): Promise<Boolean> => {
    return BotUtils.getGuild().channels.cache.filter(g => g.name.startsWith(user.id)).every(g => {
        if (g instanceof VoiceChannel) {
            return g.members.size < 1;
        } else if (g instanceof TextChannel) {
            const last: Date = g.lastMessage == null ? g.createdAt : g.lastMessage.createdAt;
            return moment.duration(moment(new Date()).diff(last)).abs().asMinutes() > 15;
        }
    })
};

const addChannel = async (guildMember: GuildMember): Promise<any> => {
    const guild: Guild = BotUtils.getGuild();
    const cate: CategoryChannel = guild.channels.cache.find(g => g.id === id.chatRoomCategory) as CategoryChannel;
    const promises: Promise<CategoryChannel | TextChannel | VoiceChannel>[] = [
        guild.channels.create(guildMember.id, {
            type: 'voice',
            topic: guildMember.user.username.concat(" 的語音頻道"),
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: "VIEW_CHANNEL"
                },
                {
                    id: guildMember.id,
                    allow: "VIEW_CHANNEL"
                },
            ],
            userLimit: 5
        }),
        guild.channels.create(guildMember.id, {
            type: 'text',
            topic: guildMember.user.username.concat(" 的文字頻道"),
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: "VIEW_CHANNEL"
                },
                {
                    id: guildMember.id,
                    allow: "VIEW_CHANNEL"
                }
            ],
            userLimit: 5
        })
    ];
    const ch = await Promise.all(promises);
    const r = await ch[0].setParent(cate);
    const r2 = await ch[1].setParent(cate);
    console.log("成功創建 " + guildMember.user.tag + " 頻道 ".concat(r.name));
    console.log("成功創建 " + guildMember.user.tag + " 頻道 ".concat(r2.name));
    return await guildMember.voice.setChannel(r).catch(r => console.log((r as Error).message));
};

const isUsing = (user: User): boolean => {
    return BotUtils.getGuild().channels.cache.some(g => g.name.startsWith(user.id));
};

const addPlayer = (user: User, joiner: User): boolean => {
    const matches: Collection<Snowflake, GuildChannel> = BotUtils.getGuild().channels.cache.filter(g => g.name.startsWith(user.id));
    if (matches.size == 0) return false;
    matches.forEach(g => {
        g.updateOverwrite(joiner, {
            VIEW_CHANNEL: true
        }).then(() => {
            console.log("成功新增權限予 ".concat(joiner.tag))
        });
    });
    return true;
};

const delPlayer = (user: User, joiner: User): boolean => {
    const matches: Collection<Snowflake, GuildChannel> = BotUtils.getGuild().channels.cache.filter(g => g.name.startsWith(user.id));
    if (matches.size == 0) return false;
    matches.forEach(g => {
        g.overwritePermissions(g.permissionOverwrites.filter(g => g.id !== joiner.id)).then(() => {
            console.log("成功刪除權限予 ".concat(joiner.tag))
        });
    });
    return true;
};

const fakeDelMap: Map<Snowflake, Snowflake[]> = new Map<Snowflake, Snowflake[]>();

const fakeDelChannel = (owner: User): boolean => {
    const matches: Collection<Snowflake, GuildChannel> = BotUtils.getGuild().channels.cache.filter(g => g.name.startsWith(owner.id));
    if (matches.size == 0) return false;
    matches.forEach(g => {
        fakeDelMap.set(owner.id, g.permissionOverwrites.keyArray());
        g.overwritePermissions([{
            id: BotUtils.getGuild().roles.everyone.id,
            deny: "VIEW_CHANNEL"
        }]).then(() => {
            console.log(`成功虛擬刪除 ${owner.tag} 的頻道。`)
        });
    });
    return true;
};

const restoreChannel = (owner: User): boolean => {
    if (!addPlayer(owner, owner)) return false;
    if (!fakeDelMap.has(owner.id)) return false;
    fakeDelMap.get(owner.id).forEach(id => {
        const user: User = BotUtils.getGuild().members.cache.get(id).user;
        if (user == undefined) return;
        addPlayer(owner, user);
    });
    console.log(`成功恢復頻道及其成員。`);
    return true;
};

const checkIdle = async (mem: GuildMember) => {
    if (!isUsing(mem.user)) return Promise.resolve();
    const bool = await idleChannel(mem);
    if (!bool || !contain(mem.user, mem)) return Promise.resolve();
    console.log(`Found ${mem.displayName} is idle Channel`);
    if (!fakeDelChannel(mem.user)) return Promise.resolve();
    console.log("Successfully deleted.");
    let m = await mem.send(`你的頻道因為閒置超過十五分鐘已被刪除。若果想恢復頻道，請在三分鐘內添加 :x: 的表情到此訊息上。`);
    const msg: Message = m instanceof Message ? m : m[0];
    await msg.react('❌');
    const col = await msg.awaitReactions((r, user) => user.id === mem.id && r.emoji.name === '❌', {
        time: 180 * 1000,
        maxEmojis: 1
    });
    if (col.size) {
        restoreChannel(mem.user);
        console.log(`${mem.displayName} has restored its channel`);
        await mem.send(`你的頻道已被恢復。`);
        const tc: TextChannel = BotUtils.getGuild().channels.cache.find(g => g.name.startsWith(mem.id) && g.type == 'text') as TextChannel;
        await tc.send(`此頻道已被恢復。`);
    } else {
        await mem.send(`已逾時，請自行到 ${BotUtils.getGuild().channels.cache.get(id.commandRoom).name} 重新輸入指令。`);
        await Promise.all(delChannel(mem.user));
        await mem.send(`你的頻道已被刪除。`);
    }
};

const launchIdleChecker = (): void => {
    setInterval(async () => {
        await BotUtils.getGuild().members.cache.forEach((async (mem) => await checkIdle(mem).catch(r => console.error((r as Error).message))));
    }, 60 * 1000);
};

const containPlayer = (joiner: GuildMember): boolean => {
    const guild: Guild = BotUtils.getGuild();
    for (let [, mem] of guild.members.cache) {
        if (guild.channels.cache.filter(g => g.name.startsWith(mem.user.id))
            .some(g => g.permissionOverwrites.some(g => g.id === joiner.id))) {
            return true;
        }
    }
    return false;
};

const contain = (user: User, joiner: GuildMember): boolean => {
    const guildChannels = BotUtils.getGuild().channels.cache.filter(g => g.name === user.id);
    if (guildChannels.size == 0) return false;
    return guildChannels.every(g => g.permissionOverwrites.some(s => s.id === joiner.id));
};

const deleteAll = () => {
    BotUtils.getGuild().members.cache.forEach(user => delChannel(user.user));
};

const ChannelManager = {
    getChannel,
    delChannel,
    isUsing,
    addPlayer,
    delPlayer,
    deleteAll,
    containPlayer,
    contain,
    addChannel,
    launchIdleChecker
};

export default ChannelManager;

