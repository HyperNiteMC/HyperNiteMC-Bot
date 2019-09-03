import * as Discord from 'discord.js';
import {Guild} from 'discord.js';
import BotUtils from "./utils/BotUtils";
import Manager from "./managers/command/CommandManager";
import auth from './secret/auth.json'
import {msgListener} from "./commands/request/program/PluginRequestProgram";
import {msgListener as TmsgListener} from './commands/request/program/TextureRequestProgram'

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
    msgListener(m);
    TmsgListener(m);
});

client.on('messageReactionAdd', (rea, user) => {
});


client.on('error', error => {
    console.warn("Got an error when running discord bot");
    console.warn(error.message);
});






