import { Message } from "discord.js";
import { Connection } from "typeorm";
export interface Command {
    name: string;
    description?: string;
    su?: boolean;
    dm: boolean;
    aliases?: string[];
    args?: boolean;
    usage?: string;
    cooldown: number;
    execute: (message: Message, args: string[], connection: Connection) => any;
}