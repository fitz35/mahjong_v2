import { getSquaredDistanceBetweenTwoPositions } from "../core/dataUtils";
import { Action, ActionType, OnClickAction, OnHitboxAction, onMouseMoveAction, OnResetAction } from "../core/gameState/Actions";
import { Context, OnActionCallback } from "../core/gameState/GameEngineState";
import { AsteroidEntity } from "./entities/AsteroidEntity";
import { FuelEntity } from "./entities/FuelEntity";
import { LaserEntity } from "./entities/LaserEntity";
import { PlayerEntity } from "./entities/PlayerEntity";
import { GameParam } from "./GameParam";

export const gameActions : OnActionCallback<GameParam>[] = [
    {
        type : ActionType.onMouseMove,
        onAction : (game: GameParam, ctx: Context, action: Action) => {
            const newGame = {...game};
            newGame.entities = game.entities.map(entiti => {
                if( action instanceof onMouseMoveAction) {
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
        type : ActionType.onRightClick,
        onAction : (game: GameParam, ctx: Context) => {
            const newGame = {...game};
            newGame.numberOfClicks += 1;
            return [newGame, {...ctx, pause : ! ctx.pause}, []];
        }
    },
    {
        type : ActionType.onClick,
        onAction : (game: GameParam, ctx: Context, action :Action) => {
            const newGame = {...game};
            if(action instanceof OnClickAction) {
                const playerEntity : PlayerEntity = newGame.entities.find(
                    entiti => entiti instanceof PlayerEntity
                ) as PlayerEntity;

                newGame.entities.push(new LaserEntity("laser" + Math.random()*100000, playerEntity.position, action.position));
            }
            return [newGame, ctx, []];
        }
    },
    {
        type : ActionType.onHitbox,
        onAction : (game: GameParam, ctx: Context, action : Action) => {
            let point = ctx.point;
            const newGame = {...game};
            if(action instanceof OnHitboxAction) {
                if((action.entitieId[0] instanceof AsteroidEntity && action.entitieId[1] instanceof PlayerEntity) ||
                    (action.entitieId[0] instanceof PlayerEntity && action.entitieId[1] instanceof AsteroidEntity)) {
                    // collision between asteroid and player
                    return [game, {...ctx, turn : ctx.turn + 1, point : point}, [new OnResetAction()]];
                }else if((action.entitieId[0] instanceof FuelEntity && action.entitieId[1] instanceof PlayerEntity) ||
                    (action.entitieId[0] instanceof PlayerEntity && action.entitieId[1] instanceof FuelEntity)) {
                    // collision between fuel and player
                    const fuelEntity = action.entitieId[0] instanceof FuelEntity ? 
                        action.entitieId[0] : action.entitieId[1];
                    point += 1;
                    newGame.entities = newGame.entities.filter(newE => newE.id !== fuelEntity.id);
                }else if(
                    (action.entitieId[0] instanceof LaserEntity && action.entitieId[1] instanceof AsteroidEntity) ||
                    (action.entitieId[0] instanceof AsteroidEntity && action.entitieId[1] instanceof LaserEntity)
                ) {
                    // collision between laser and asteroid
                    newGame.entities = newGame.entities.filter(
                        newE => newE.id !== action.entitieId[0].id && newE.id !== action.entitieId[1].id
                    );
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
                const position = {x : Math.ceil(Math.random()*ctx.width), y : Math.ceil(Math.random()*ctx.height)};
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