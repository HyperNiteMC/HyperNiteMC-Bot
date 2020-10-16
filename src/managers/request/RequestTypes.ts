import {Message, User} from "discord.js";

export abstract class Requested {
    state: RequestState | any;
    message: Message;

    abstract async sendChannel(user: User): Promise<any>;

    public abstract async handleMessage(user: User, message: Message): Promise<boolean>;
}

export enum RequestState {
    FINISH
}
