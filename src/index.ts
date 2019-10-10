import * as Discord from 'discord.js';
import {Guild, Message} from 'discord.js';
import BotUtils from "./utils/BotUtils";
import Manager from "./managers/command/CommandManager";
import auth from './secret/auth.json'
import {handleMessage} from "./managers/request/RequestedManager";
import './managers/MySQLManager'

const client = new Discord.Client();


client.login(auth.token).then(r => {
    const guild: Guild = client.guilds.get('313607220140965888');

    if (guild == undefined) {
        console.warn("The bot has not joined the HNMC Discord Guild! This bot will not activate.");
    } else {
        BotUtils.activate(client, guild);
        console.log("The bot has been activated.")
    }
}).catch(r => {
    if (r instanceof Error) {
        console.warn(r.message);
    }
});

client.on('ready', () => {
    console.log("This bot is ready to be activated");
});

client.on('message', m => {
    if (Manager.invoke(m)) return;
    handleMessage(m).catch((err: Error) => {
        console.error(err);
        m.channel.send(`Error -> ${err.name}: ${err.message}`)
    });
});

client.on('messageReactionAdd', (rea, user) => {
    if (rea.message.channel.id == '617330086789775400') {
        const name: string = rea.emoji.name;
        const msg: Message = rea.message;
        if (msg.author !== user) {
            msg.reactions.filter(rea => rea.emoji.name !== name).forEach((async (rea) => await rea.remove(user)));
        }
    }
});


client.on('error', error => {
    console.warn("Got an error when running discord bot");
    console.warn(error.message);
});






