import * as Discord from 'discord.js';
import {Guild} from 'discord.js';
import auth from "./secret/auth.json";
import room from './secret/id.json';
import './managers/MySQLManager'
import connection, {close} from "./managers/MySQLManager";

const client = new Discord.Client();

const debug = () => {
    console.log("validating hypernite-mc guild id...")
    const guild: Guild = client.guilds.cache.get(room.guild);
    if (guild == undefined) {
        console.error("The bot has not joined the HNMC Discord Guild!");
        process.exit(1);
    } else {
        console.log("validated successful")
        console.log(`HyperNiteMC Discord Bot has been successfully tested`)
        console.log('closing mysql connection')
        close().then(() => console.log('successfully closed')).catch(err => {
            console.error(err);
            process.exit(1);
        }).finally(() => process.exit(0));

    }
};

console.log("testing login with token...")
client.login(auth.token)
    .then(() => {
        console.log("tested successful")
        console.log("testing connecting to mysql...")
        return connection()
    })
    .then(() => console.log("tested successful"))
    .catch(err => {
        console.error(err);
        process.exit(1);
    })


client.on('ready', () => {
    console.log("This bot is now on ready state");
    debug();
});
