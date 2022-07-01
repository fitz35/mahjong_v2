import { getSquaredDistanceBetweenTwoPositions } from "../core/dataUtils";
import { Action, ActionType, OnClickAction, OnHitboxAction, OnResetAction } from "../core/gameState/Actions";
import { Context, OnActionCallback } from "../core/gameState/GameEngineState";
import { AsteroidEntity } from "./entities/AsteroidEntity";
import { FuelEntity } from "./entities/FuelEntity";
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
        onAction : (game: GameParam, ctx: Context, action : Action) => {
            let point = ctx.point;
            const newGame = {...game};
            if(action instanceof OnHitboxAction) {
                for(const entitie of action.entitieId) {
                    if(entitie instanceof AsteroidEntity) {
                        return [game, {...ctx, turn : ctx.turn + 1, point : point}, [new OnResetAction()]];
                    }else if(entitie instanceof FuelEntity) {
                        point += 1;
                        newGame.entities = newGame.entities.filter(newE => newE.id !== entitie.id);
                    }  
                }
            }
            return [newGame, {...ctx, point : point}, []];
        }
    },
    {
        type : ActionType.onAleaEvent,
        onAction : (game: GameParam, ctx: Context, action: Action) => {
            const newGame = {...game};
            if(action.payload === "alea apparitionAsteroid") {
                const position = {x : Math.ceil(Math.random()*500), y : Math.ceil(Math.random()*500)};
                let player : PlayerEntity | undefined = undefined;
                for(const entitie of newGame.entities) {
                    if(entitie instanceof PlayerEntity) {
                        player = entitie;
                        break;
                    }
                }
                if(player !== undefined && getSquaredDistanceBetweenTwoPositions(player.position, position) > 50 * 50) {
                    const asteroid = new AsteroidEntity("wall" + Math.random()*100000, position);
                    newGame.entities = [...game.entities, asteroid];
                }
            }else if(action.payload === "alea apparitionFuel") {
                const fuel = new FuelEntity("fuel" + Math.random()*100000);
                newGame.entities = [...game.entities, fuel];
            }
            return [newGame, ctx, []];
        }
    }
];