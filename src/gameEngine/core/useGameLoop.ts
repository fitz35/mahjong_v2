import { useEffect, useState } from "react";
import { MyLogger } from "../../model/utils/logger";
import { Action, Game, GameEngineState } from "./gameState/GameEngineState";
import { useTimer } from "./useTimer";

function callbackGame<T extends Game>(
    timeElapsed : number, 
    gameState : GameEngineState<T>, 
    actions : Action[]
) : GameEngineState<T> {
    const newGameState = { ...gameState };
    // call the action
    for (const action of actions) {
        for(const actionCallback of gameState.onActionCallbacks){
            if(action.type === actionCallback.type){
                const [gameStateApply, newContext] = actionCallback.onAction(newGameState.G, newGameState.ctx, action);
                newGameState.G = gameStateApply;
                newGameState.ctx = newContext;
            }
        }
    }

    // update the entities
    newGameState.G.entities = newGameState.G.entities.map(entity => {
        entity = entity.updatePosition(timeElapsed/1000);
        entity = entity.updateVelocity(timeElapsed/1000);
        return entity;
    });

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