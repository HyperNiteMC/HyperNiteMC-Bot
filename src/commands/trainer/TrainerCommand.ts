import DefaultCommand from "../../managers/command/DefaultCommand";
import BotUtils from "../../utils/BotUtils";
import PassCommand from "./PassCommand";

export default class TrainerCommand extends DefaultCommand {

    sendUser: boolean = true;

    constructor() {
        super(null, "trainer", BotUtils.getChannels(), BotUtils.findRole('606838578789482506'), "考官專用指令");
        this.addSub(new PassCommand(this));
    }


}
