import { ConnectionOptions, createConnection } from "typeorm";
import * as path from "path";
import { Command } from "../classes/bot/Command";
import { Server } from "../classes/entity/Server";
import { i18n } from "../i18n";

const command: Command = {
    name: "init",
    su: true,
    dm: false,
    async execute(message, args, connection) {
        const servers = await connection.manager.find(Server, { id: message.guild.id });
        if(servers.length > 0) {
            console.log("server init-ed, skipping");
            message.channel.send(`This server has already been initiated`);
            return;
        }
        const server = new Server();
        server.id = message.guild.id;
        server.lang = args[0];
        server.usegloballang = args[1] === "true";
        server.disabled = args[2] === "true";
        server.setup = args[3] === "true";
        await connection.manager.save(server);
        const newServers = await connection.manager.find(Server, { id: message.guild.id });
        console.log("Loaded servers: ", newServers);
        message.channel.send(`Initiated server with id ${message.guild.id}`);
    }
};
export default command;