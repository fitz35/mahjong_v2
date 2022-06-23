import { GameEngine } from "../../model/gameEngine/core/GameEngine";
import { gameActions } from "../../model/gameEngine/asteroid/GameAction";
import { gameParam } from "../../model/gameEngine/asteroid/GameParam";
import { useState } from "react";

export function CustomPlay() {
    const [perdu, setPerdu] = useState(0);
    return (
        <div>
            <GameEngine
                width={500}
                height={500}
                game={gameParam}
                callbacks={gameActions}
                onGameChange={(game) => {
                    setPerdu(game.ctx.turn);
                }}
            ></GameEngine>
            <span>
                perdu :{perdu}
                foix
            </span>
        </div>
    );
}
