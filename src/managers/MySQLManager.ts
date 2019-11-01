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
    const con = await createConnection(options);
    return await con.synchronize();
};

export default connection;
