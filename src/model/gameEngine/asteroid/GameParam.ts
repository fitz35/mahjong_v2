import { Entity } from "../core/gameState/Entity";
import { AleaInterface, Game } from "../core/gameState/GameEngineState";
import { PlayerEntity } from "./entities/PlayerEntity";

export interface GameParam extends Game {
    entities : Entity[];
    numberOfClicks : number;
    aleaEvents: AleaInterface<Game>[];
}

export const gameParam : GameParam = {
    entities : [
        new PlayerEntity(
            "player",
            {
                x : 0,
                y : 0
            },
            200
        ),
    ],
    numberOfClicks : 0,
    aleaEvents : [
        {
            id : "apparitionAsteroid",
            frequency : 40,
            guardFunction : () => {
                return true;
            }
        },
        {
            id : "apparitionFuel",
            frequency : 1.5,
            guardFunction : () => {
                return true;
            }
        }
    ]
};