import { Entity } from "./core/gameState/Entity";
import { Game } from "./core/gameState/GameEngineState";
import { PlayerEntity } from "./entities/PlayerEntity";

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
            50
        )
    ],
    numberOfClicks : 0
};