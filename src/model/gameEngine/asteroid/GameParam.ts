import { Entity } from "../core/gameState/Entity";
import { Game } from "../core/gameState/GameEngineState";
import { PlayerEntity } from "./entities/PlayerEntity";
import { AsteroidEntity } from "./entities/AsteroidEntity";

export interface GameParam extends Game {
    entities : Entity[];
    numberOfClicks : number;
}

export const gameParam : GameParam = {
    entities : [
        new PlayerEntity(
            "player",
            {
                x : 0,
                y : 0
            },
            100
        ),
        new AsteroidEntity(
            "wall1",
            {
                x : 50,
                y : 50
            }
        )
    ],
    numberOfClicks : 0
};