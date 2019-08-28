import DefaultCommand from "../../managers/command/DefaultCommand";
import CommandNode from "../../managers/command/CommandNode";
import BotUtils from "../../utils/BotUtils";
import UserLimitCommand from "./settings/UserLimitCommand";

export default class EditSettingsCommand extends DefaultCommand {

    sendUser: false;

    constructor(parent: CommandNode) {
        super(parent, "set", BotUtils.getCommandChannels(), BotUtils.getRoles(), "房間設定指令", "setting", "editsetting");
        this.addSub(new UserLimitCommand(this));
    }
}
