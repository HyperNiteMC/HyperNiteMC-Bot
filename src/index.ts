import * as Discord from 'discord.js';
import {Guild, Message, TextChannel} from 'discord.js';
import BotUtils from "./utils/BotUtils";
import Manager from "./managers/command/CommandManager";
import auth from "./secret/auth.json";
import room from './secret/id.json';
import {handleMessage} from "./managers/request/RequestedManager";
import './managers/MySQLManager'
import isIllegal from "./managers/IllegalChatManager";
import connection from "./managers/MySQLManager";

const client = new Discord.Client();

export const version = "v0.0.12"

const activate = () => {
    const guild: Guild = client.guilds.cache.get(room.guild);
    if (guild == undefined) {
        console.warn("The bot has not joined the HNMC Discord Guild! This bot will not activate.");
    } else {
        BotUtils.activate(client, guild);
        console.log(`HyperNiteMC Discord Bot ${version} has been activated.`)
    }
};

client.login(auth.token)
    .then(() => connection().catch(console.error))
    .catch(r => {
        if (r instanceof Error) {
            console.warn(r.message);
        }
    });


client.on('ready', () => {
    console.log("This bot is ready to be activated");
    activate();
});

client.on('message', m => {
    if (m.webhookID) return; //if it is web hook
    if (Manager.invoke(m)) return;
    Promise.all([handleMessage(m), isIllegal(m)]).then(([, illegal]) => {
        if (illegal) {
            Promise.all([m.delete({timeout: 0, reason: '請勿發送違規訊息。'}), m.reply(`請勿發送違規訊息。`)]).catch(console.error);
            console.warn(`${m.author.tag} saying illegal chat: ${m.content}`)
        }
    }).catch((err: Error) => {
        console.error(err);
        m.channel.send(`Error -> ${err.name}: ${err.message}`)
    });
});

client.on('messageReactionAdd', (rea, user) => {
    if (rea.message.channel.id == '617330086789775400') {
        const msg: Message = rea.message;
        if (msg.author !== user) {
            Promise.all(msg.reactions.cache.filter(r => !r.users.cache.size).map(r => r.users.fetch())).then(() => {
                if (msg.reactions.cache.some(r => r.users.resolve(user.id) !== null && rea.emoji.name != r.emoji.name)) {
                    rea.users.remove(user.id).then(() => console.log(`已刪除重複投票用戶 ${user.username} 上一張的投票。`))
                }

                /*
                const voted = []
                msg.reactions.cache.forEach(reaction => {
                    reaction.users.cache.forEach(u => {
                        if (voted.includes(u.id)) {
                            reaction.users.remove(u.id).then(() => console.log(`已刪除重複投票用戶 ${u.username} 的投票`))
                        }else{
                            voted.push(u.id)
                        }
                    })
                })

                 */
            })
        }


    }
});


// copy from web, for fetch reaction event
client.on('raw', packet => {
    // We don't want this to run on unrelated packets
    if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    // Grab the channel to check the message from
    const channel = client.channels.cache.get(packet.d.channel_id);
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (!(channel instanceof TextChannel)) return;
    if (channel.messages.cache.has(packet.d.message_id)) return;
    // Since we have confirmed the message is not cached, let's fetch it
    channel.messages.fetch(packet.d.message_id).then(message => {
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.cache.get(emoji);
        // Adds the currently reacting user to the reaction's users collection.
        if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
        }
        if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
        }
    });
});


client.on('error', error => {
    console.warn("Got an error when running discord bot");
    console.warn(error.message);
});
