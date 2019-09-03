import DefaultCommand from "../../managers/command/DefaultCommand";
import BotUtils from "../../utils/BotUtils";
import {TextChannel} from "discord.js";
import AcceptCommand from "./AcceptCommand";
import CreateCommand from "./CreateCommand";
import DeleteCommand from "./DeleteCommand";

export default class RequestCommand extends DefaultCommand {

    sendUser = true;

    constructor() {
        super(null, "request", BotUtils.findChannels(TextChannel, '586539557789368340', '586550731142725642'), BotUtils.getRoles(), "委託指令");
        this.addSub(new AcceptCommand(this));
        this.addSub(new CreateCommand(this));
        this.addSub(new DeleteCommand(this));
    }
}
