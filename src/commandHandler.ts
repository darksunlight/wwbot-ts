import { Collection, Message } from "discord.js";
import * as fs from "fs";
import { Connection } from "typeorm";
import { Command } from "./classes/bot/Command";

const sudoers = ["531822031059288074"];

const commands = new Collection<string, Command>();
const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith('.ts'));
for (const file of commandFiles) {
	import(`./commands/${file}`).then(command => {
        commands.set(command.default.name, command.default);
    }).catch(console.error);
}

const cooldowns = new Collection<string, Collection<string, number>>();

const commandHandler = (prefix: string, message: Message, connection: Connection) => {
    if (message.author.bot) return;
    const content = message.content;
    if (content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command) return;

        if (command.su && !sudoers.includes(message.author.id)) return message.channel.send(`${message.author.tag} is not in the sudoers file. This incident will be reported.`);

        if (message.channel.type === "dm" && !command.dm) return message.channel.send(`:x: This command cannot be used in DMs`);

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            if (command.usage) {
                reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``;
            }
            return message.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection<string, number>());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = command.cooldown * 1000;
        
        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.channel.send(`<@${message.author.id}>, please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }        
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        command.execute(message, args, connection);
    }
    return;
}

export { commandHandler, commands };