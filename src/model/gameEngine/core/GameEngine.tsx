import { useEffect, useRef } from "react";
import { OnClickAction } from "./gameState/Actions";
import { Position } from "./gameState/Entity";
import { getInvolvedEntityIds } from "./gameState/entityUpdate";
import {
    Game,
    GameEngineState,
    OnActionCallback,
} from "./gameState/GameEngineState";
import { useGameLoop } from "./useGameLoop";

interface GameEngineProps<T extends Game> {
    width: number;
    height: number;

    game: T;
    callbacks: OnActionCallback<T>[];

    onGameChange?: (game: GameEngineState<T>) => void;
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
    onGameChange,
}: GameEngineProps<T>) {
    const [newGameState, addAction] = useGameLoop({
        G: game,
        ctx: {
            turn: 0,
            numberOfPlayer: 4,
            playerToPlay: 0,
            width,
            height,
        },
        onActionCallbacks: callbacks,
        initG: game,
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
        if (onGameChange !== undefined) {
            onGameChange(newGameState);
        }
    }, [canvasRef, height, newGameState, onGameChange, width]);

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
