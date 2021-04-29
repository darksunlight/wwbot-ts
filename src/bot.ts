import { Client } from "discord.js";
import { Connection } from "typeorm";
import { commandHandler } from "./commandHandler";
require("dotenv").config();

const client = new Client();
const prefix = "!";

let dbConnection: Connection;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", msg => {
    commandHandler(prefix, msg, dbConnection);
});

const start = (connection: Connection) => {
    client.login();
    dbConnection = connection;
};

export { start };