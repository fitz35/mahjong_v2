import { Action, ActionType, Context, OnActionCallback, OnClickAction } from "./core/gameState/GameEngineState";
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

            return [newGame, ctx];
        }
    }
];