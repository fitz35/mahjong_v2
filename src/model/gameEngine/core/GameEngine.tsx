import { useEffect, useRef } from "react";
import { Position } from "./gameState/Entity";
import { getInvolvedEntityIds } from "./gameState/entityUpdate";
import {
    Game,
    OnActionCallback,
    OnClickAction,
} from "./gameState/GameEngineState";
import { useGameLoop } from "./useGameLoop";

interface GameEngineProps<T extends Game> {
    width: number;
    height: number;

    game: T;
    callbacks: OnActionCallback<T>[];
}
/**
 * manage the game engine
 * @returns
 */
export function GameEngine<T extends Game>({
    width,
    height,
    game,
    callbacks,
}: GameEngineProps<T>) {
    const [newGameState, addAction] = useGameLoop({
        G: game,
        ctx: {
            turn: 0,
            numberOfPlayer: 4,
            playerToPlay: 0,
        },
        onActionCallbacks: callbacks,
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, width, height);
                for (const entitie of newGameState.G.entities) {
                    entitie.onDraw(ctx);
                }
            }
        }
    }, [canvasRef, height, newGameState, width]);

    // handle click action
    const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const canvasRect = canvas.getBoundingClientRect();
            const pos: Position = {
                x: event.pageX - canvasRect.left,
                y: event.pageY - canvasRect.top,
            };
            addAction(
                new OnClickAction(
                    getInvolvedEntityIds(newGameState.G.entities, pos),
                    pos
                )
            );
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={onCanvasClick}
        />
    );
}
