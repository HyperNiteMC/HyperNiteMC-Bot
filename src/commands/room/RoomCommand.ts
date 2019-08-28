import DefaultCommand from "../../managers/command/DefaultCommand";
import BotUtils from "../../utils/BotUtils";
import CreateCommand from "./CreateCommand";
import DestroyCommand from "./DestroyCommand";
import EditSettingsCommand from "./EditSettingsCommand";
import AddPlayerCommand from "./AddPlayerCommand";
import DelPlayerCommand from "./DelPlayerCommand";

export default class RoomCommand extends DefaultCommand {
    sendUser?: boolean;

    constructor() {
        super(null, "room", BotUtils.getCommandChannels(), BotUtils.getRoles(), "房間管理指令");
        this.addSub(new CreateCommand(this));
        this.addSub(new DestroyCommand(this));
        this.addSub(new EditSettingsCommand(this));
        this.addSub(new AddPlayerCommand(this));
        this.addSub(new DelPlayerCommand(this));
    }

}
