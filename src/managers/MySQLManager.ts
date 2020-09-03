import {ConnectionOptions, createConnection} from "typeorm";
import {Requester} from '../entity/Entites'
import mysql from '../secret/mysql.json'

const options: ConnectionOptions = {
    ...mysql,
    type: 'mysql',
    entities: [
        Requester
    ]
};

const connection = async () => {
    console.log('connecting to mysql...')
    const con = await createConnection(options);
    await con.synchronize();
    console.log('mysql connected.')
};

export default connection;
