import DefaultCommand from "../../managers/command/DefaultCommand";
import BotUtils from "../../utils/BotUtils";
import {TextChannel} from "discord.js";
import AcceptCommand from "./AcceptCommand";
import CreateCommand from "./CreateCommand";
import DeleteCommand from "./DeleteCommand";
import id from '../../secret/id.json'

export default class RequestCommand extends DefaultCommand {

    sendUser = true;

    constructor() {
        super(null, "request", BotUtils.findChannels(TextChannel, RequestCommand.channelId), BotUtils.getRoles(), "委託指令");
        this.addSub(new AcceptCommand(this));
        this.addSub(new CreateCommand(this));
        this.addSub(new DeleteCommand(this));
    }

    static get channelId(): string {
        return id.requestChannel;
    }
}
