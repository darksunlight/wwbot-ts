import { Command } from "../classes/bot/Command";
import { Server } from "../classes/entity/Server";

const command: Command = {
    name: "logstatus",
    su: true,
    dm: true,
    async execute(message, args, connection) {
        const servers = await connection.getRepository(Server).createQueryBuilder("server").getMany();
        console.log("Loaded servers: ", servers);
    }
};
export default command;