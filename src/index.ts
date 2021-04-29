import "reflect-metadata";
import * as path from "path";
import { ConnectionOptions, createConnection } from "typeorm";
import { start } from "./bot";
import { Game } from "./classes/entity/Game";
import { Player } from "./classes/entity/Player";
import { Server } from "./classes/entity/Server";

/*
createConnection(options).then(async connection => {
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Tumber";
    user.lastName = "See";
    user.age = 24;
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
*/
const connectionOptions: ConnectionOptions = {
    type: "sqlite",
    database: `${path.resolve(__dirname, "..")}/database.sqlite`,
    entities: [ Game, Player, Server ],
    logging: true,
    synchronize: true
};
createConnection(connectionOptions).then(connection => {
    start(connection);
});