import { Command } from "../classes/bot/Command";
import { commands } from "../commandHandler";
import { i18n } from "../i18n";

const command: Command = {
    name: 'help',
    aliases: ['commands', 'man'],
    usage: '[command name]',
    cooldown: 1,
    dm: true,
    execute(message, args) {
        const data = [];
        const prefix = "!";
        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send(i18n("cmd-help-invalid-cmd", message, message.author.id)).then(_=>console.log(message.author.tag + " used !help to get info about command " + name + " but failed because " + name + " is not a valid command."));
        }

        data.push(i18n("cmd-help-name", message, command.name));

        if (command.aliases) data.push(i18n("cmd-help-aliases", message, command.aliases.join(i18n("comma-separator", message)), command.aliases.length));
        if (command.description) data.push(i18n("cmd-help-desc-string", message, i18n(command.description, message)));
        if (command.usage) data.push(i18n("cmd-help-usage", message, prefix.concat(command.name, " ", command.usage)));

        data.push(i18n("cmd-help-cooldown", message, i18n("seconds", message, command.cooldown || 1)))

        return message.channel.send(data, { split: true });
    }
};

export default command;