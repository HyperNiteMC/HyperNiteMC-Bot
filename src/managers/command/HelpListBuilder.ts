import CommandNode from "./CommandNode";

class HelpListBuilder {

    private readonly mainCommand: string;

    constructor(commandNode: CommandNode) {
        let root: CommandNode = commandNode;
        let cmdNode: string = commandNode.command;
        while (root.parent != null) {
            root = root.parent;
            cmdNode = root.command.concat(" ").concat(cmdNode);
        }
        this.mainCommand = cmdNode;
        this._helps.push("==== [ ".concat("!").concat(this.mainCommand).concat(" 指令幫助").concat(" ] ===="));
    }

    private _helps: string[] = [];

    get helps(): string[] {
        return this._helps;
    }

    append(node: CommandNode): void {
        let cmd = "!".concat(this.mainCommand).concat(" ");
        for (let alias of node.alias) {
            if (alias.includes(" ")) {
                continue;
            }
            cmd += alias;
            break;
        }
        if (node.placeholders.length > 0) {
            cmd = cmd + " " + node.placeholders.join(' ');
        }
        cmd = cmd.concat(" - ").concat(node.description);
        this._helps.push(cmd);
    }
}

export default HelpListBuilder;
