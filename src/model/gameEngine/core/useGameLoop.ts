import { useEffect, useState } from "react";
import { eliminateUndefined } from "../../utils/setUtils";
import { Action, ActionType, OnAleaEventAction, OnHitboxAction, OnUserAction } from "./gameState/Actions";
import { Game, GameEngineState } from "./gameState/GameEngineState";
import { useTimer } from "./useTimer";


function handleAction<T extends Game>(
    gameState : GameEngineState<T>, 
    actions : Action[]
) : GameEngineState<T> {
    const newGameState = { ...gameState };
    const userAction : OnUserAction[] = [];
    // call the action
    for (const action of actions) {
        // test the reset action
        if(action.type === ActionType.onReset){
            return { ...newGameState, G : gameState.initG };
        }else{
            for(const actionCallback of gameState.onActionCallbacks){
                if(action.type === actionCallback.type){
                    const [gameStateApply, newContext, newAction] = 
                            actionCallback.onAction(newGameState.G, newGameState.ctx, action);
                    newGameState.G = gameStateApply;
                    newGameState.ctx = newContext;
                    userAction.push(...newAction);
                }
            }
        }
    }
    if(userAction.length > 0){
        return handleAction(newGameState, userAction);
    }else{
        return newGameState;
    }
}


/**
 * 
 * @param timeElapsed the time elapsed since the last trigger of the game
 * @param gameState the old game state
 * @param actions the actions to be triggered
 * @returns the new game state
 */
function callbackGame<T extends Game>(
    timeElapsed : number, 
    gameState : GameEngineState<T>, 
    actions : Action[]
) : GameEngineState<T> {
    // compute hitbox
    const hitBoxAction : OnHitboxAction[] = eliminateUndefined(gameState.G.entities.flatMap(entity => {
        const entityHits = entity.onHitbox(gameState.G.entities);
        if(entityHits.length > 0){
            return new OnHitboxAction(entityHits);
        }else{
            return undefined;
        }
    }));

    // compute alea event
    const aleaEvent : OnAleaEventAction<T>[] = eliminateUndefined(gameState.G.aleaEvents.flatMap(aleaEvent => {
        const alea = Math.random()*100;
        if(aleaEvent.frequency > alea){
            return new OnAleaEventAction([], aleaEvent.id, () => true);
        }else{
            return undefined;
        }
    }));

    // call the action
    const newGameState = handleAction(gameState, [...actions, ...hitBoxAction, ...aleaEvent]);
    
    // update the entities
    newGameState.G.entities = eliminateUndefined(newGameState.G.entities.map(entity => {
        entity = entity.updatePosition(timeElapsed/1000);
        entity = entity.updateVelocity(timeElapsed/1000);
        // eliminate the entity if it is out of the screen
        if(entity.position.x < 0 || 
            entity.position.x > gameState.ctx.width || 
            entity.position.y < 0 || 
            entity.position.y > gameState.ctx.height){
            return undefined;
        }else{
            return entity;
        }
    }));

    return newGameState;
}

/**
 * 
 * @param gameStateProps the game state to use (initial)
 * @returns the new gameState and the function to add an action
 */
export function useGameLoop<T extends Game> (gameStateProps : GameEngineState<T>) : [
    GameEngineState<T>,
    (action: Action) => void
] {
    const [gameState, setGameState] = useState(gameStateProps);
    const [actions, setActions] = useState<Action[]>([]);
    const [, setCallback] = useTimer();

    // modify the callback everytime we have an action encountered
    useEffect(() => {
        const newCallback = (timeElapsed : number) => {
            setGameState(g => callbackGame(timeElapsed, g, actions));
            if(actions.length > 0){
                setActions([]);
            }
        };
        setCallback(newCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions]);

    const addAction = (action : Action) => {
        setActions(actions => [...actions, action]);
    };

    return [gameState, addAction];    
}