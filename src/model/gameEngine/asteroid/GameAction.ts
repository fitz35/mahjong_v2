import { MyLogger } from "../../utils/logger";
import { Action, ActionType, OnClickAction } from "../core/gameState/Actions";
import { Context, OnActionCallback } from "../core/gameState/GameEngineState";
import { PlayerEntity } from "./entities/PlayerEntity";
import { GameParam } from "./GameParam";

export const gameActions : OnActionCallback<GameParam>[] = [
    {
        type : ActionType.onClick,
        onAction : (game: GameParam, ctx: Context, action: Action) => {
            const newGame = {...game};
            newGame.entities = game.entities.map(entiti => {
                if( action instanceof OnClickAction){
                    if(entiti instanceof PlayerEntity) {
                        entiti.setTarget(action.position);
                        entiti.go();
                        return entiti;
                    }else{
                        return entiti;
                    }
                }else{
                    return entiti;
                }
            });

            return [newGame, ctx, []];
        }
    },
    {
        type : ActionType.onClick,
        onAction : (game: GameParam, ctx: Context) => {
            const newGame = {...game};
            newGame.numberOfClicks += 1;
            return [newGame, ctx, []];
        }
    },
    {
        type : ActionType.onHitbox,
        onAction : (game: GameParam, ctx: Context, action: Action) => {
            MyLogger.info("onHitbox");
            return [game, ctx, []];
        }
    }
];