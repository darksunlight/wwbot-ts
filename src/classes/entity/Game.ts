import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Server } from "./Server";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roles: string;

    @Column("simple-array")
    aliveRaw: boolean[];

    @Column()
    date: Date;

    @Column()
    outcome: 0 | 1 | 2;

    @ManyToOne(() => Server, server => server.games, {cascade: true})
    server: Server;

}
