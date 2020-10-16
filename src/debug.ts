import * as Discord from 'discord.js';
import {Guild} from 'discord.js';
import BotUtils from "./utils/BotUtils";
import auth from "./secret/auth.json";
import room from './secret/id.json';
import './managers/MySQLManager'
import connection from "./managers/MySQLManager";

const client = new Discord.Client();

export const version = "v0.0.12"

const debug = () => {
    const guild: Guild = client.guilds.cache.get(room.guild);
    if (guild == undefined) {
        console.warn("The bot has not joined the HNMC Discord Guild!");
        process.exit(1);
    } else {
        BotUtils.activate(client, guild);
        console.log(`HyperNiteMC Discord Bot ${version} has successfully tested`)
        process.exit(0);
    }
};

client.login(auth.token)
    .then(() => connection().catch(console.error))
    .catch(r => {
        if (r instanceof Error) {
            console.warn(r.message);
            process.exit(1);
        }
    });


client.on('ready', () => {
    console.log("This bot is ready to be tested");
    debug();
});
