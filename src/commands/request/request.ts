import {Message} from "discord.js";

export interface Requested {
    state: RequestState | any
    message: Message | Message[];
}

export enum RequestState {
    FINISH
}
