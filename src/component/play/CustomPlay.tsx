import { GameEngine } from "../../model/gameEngine/core/GameEngine";
import { gameActions } from "../../model/gameEngine/GameAction";
import { gameParam } from "../../model/gameEngine/GameParam";

export function CustomPlay() {
    return (
        <GameEngine
            width={500}
            height={500}
            game={gameParam}
            callbacks={gameActions}
        ></GameEngine>
    );
}
