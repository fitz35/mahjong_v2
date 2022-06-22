import { GameEngine } from "../../gameEngine/core/GameEngine";
import { gameActions } from "../../gameEngine/GameAction";
import { gameParam } from "../../gameEngine/GameParam";

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
