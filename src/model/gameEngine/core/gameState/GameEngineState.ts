import { Action, ActionType, OnUserAction } from "./Actions";
import { Entity } from "./Entity";


/////////////////////////////////////////////////////////////
// Game

/**
 * the game state
 */
export interface Game {
    entities: Entity[];
}

/////////////////////////////////////////////////////////////
// GameEngine

/**
 * the game engine context
 */
export interface Context {
    turn: number;
    playerToPlay: number;
    numberOfPlayer: number;
}

/**
 * callback call when action trigered
 */
export interface OnActionCallback<T extends Game> {
    type : ActionType;
    onAction: (game: T, ctx: Context, action: Action) => [T, Context, OnUserAction[]];
}

/**
 * the engine state
 */
export interface GameEngineState<T extends Game> {
    G: T;
    ctx: Context;
    onActionCallbacks: OnActionCallback<T>[];
}
