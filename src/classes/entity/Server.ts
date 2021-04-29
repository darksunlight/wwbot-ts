import {Entity, Column, PrimaryColumn, OneToMany} from "typeorm";
import { Game } from "./Game";

@Entity()
export class Server {

    @PrimaryColumn()
    id: string;

    @Column()
    lang: string;

    @Column()
    usegloballang: boolean;

    @Column()
    disabled: boolean;

    @Column()
    setup: boolean;

    @OneToMany(() => Game, game => game.server)
    games: Game[]

}
