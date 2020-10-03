import {GuildMember, Role, TextChannel} from "discord.js";

abstract class CommandNode {

    private readonly _command: string;
    private readonly _allowChannels: Set<TextChannel>;
    private readonly _alias: string[];
    private readonly _allowRoles: Set<Role>;
    private readonly _placeholders: string[];
    private readonly _description: string;
    private readonly _parent: CommandNode;

    protected constructor(parent: CommandNode, command: string, allowChannels: Set<TextChannel>, allowRoles: Set<Role>, description: string, placeholders: string[], ...alias: string[]) {
        this._parent = parent;
        this._command = command;
        this._allowChannels = allowChannels;
        this._allowRoles = allowRoles;
        this._placeholders = placeholders;
        this._description = description;
        this._alias = [command, ...alias];
    }

    get alias(): string[] {
        return this._alias;
    }

    get parent(): CommandNode {
        return this._parent;
    }

    get placeholders(): string[] {
        return this._placeholders;
    }

    get description(): string {
        return this._description;
    }

    get allowChannels(): Set<TextChannel> {
        return this._allowChannels;
    }

    get command(): string {
        return this._command;
    }

    private _subCommands: Set<CommandNode> = new Set<CommandNode>();

    protected get subCommands(): Set<CommandNode> {
        return this._subCommands;
    }

    public abstract async execute(channel: TextChannel, guildMember: GuildMember, args: string[]);

    public async invokeCommand(args: string[], channel: TextChannel, guildMember: GuildMember) {
        if (args.length > 0) {
            for (const node of this._subCommands.values()) {
                if (node.match(args[0])) {
                    args.shift();
                    const placeholders: string[] = this._placeholders.filter(s => s.startsWith("<") && s.endsWith(">"));
                    if (args.length < placeholders.length) {
                        channel.send("缺少參數: ".concat(placeholders.join(' '))).then();
                        return;
                    }
                    await node.invokeCommand(args, channel, guildMember);
                    return;
                }
            }
        }
        if (!this._allowChannels.has(channel)) {
            await channel.send("此頻道無法使用此指令。");
            return;
        }
        if (!this.matchRole(guildMember)) {
            await channel.send("你沒有權限使用此指令。");
            return;
        }
        const placeholders: string[] = this._placeholders.filter(s => s.startsWith("<") && s.endsWith(">"));
        if (args.length < placeholders.length) {
            await channel.send("缺少參數: ".concat(placeholders.join(' ')));
            return;
        }
        this.execute(channel, guildMember, args.map(s => s
            .replace("[", "")
            .replace("]", "")
            .replace("<", "")
            .replace(">", "")))
            .catch((err: Error) => {
                console.error(err);
                return channel.send(`Error -> ${err.name}: ${err.message}`)
            });
    }

    public matchRole(member: GuildMember): boolean {
        return [...this._allowRoles].some(role => member.roles.highest.comparePositionTo(role) > -1);
    }

    public match(arg: string): boolean {
        return this._alias.indexOf(arg, 0) !== -1
    }

    public addSub(subCommand: CommandNode): void {
        this._subCommands.add(subCommand);
    }


}

export default CommandNode;
