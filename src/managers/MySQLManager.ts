import {Connection, ConnectionOptions, createConnection} from "typeorm";
import {Requester} from '../entity/Entites'
import mysql from '../secret/mysql.json'

const options: ConnectionOptions = {
    ...mysql,
    type: 'mysql',
    entities: [
        Requester
    ],
    synchronize: true
};

let con: Connection = null

const connection = async () => {
    console.log('connecting to mysql...')
    con = await createConnection(options);
    console.log('mysql connected.')
};

export default connection;

export const close = async () => con?.close()
