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

createConnection(options).then(con => con.synchronize()).catch(r => console.error(r));


