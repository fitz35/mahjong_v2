/////////////////////////////////////////////////////////////
// actions

import { Entity, Position } from "./Entity";

/**
 * the possible action to be done by the game engine
 */
export enum ActionType {
    onClick = "onClick",
    onKeyDown = "onKeyDown",
    onUserEvent = "onUserEvent",
}

/**
 * an action
 */
export class Action {
    type: ActionType;
    payload: string;
    entitieId: string[];
    constructor(type: ActionType, payload: string, entitieId: string[]) {
        this.type = type;
        this.payload = payload;
        this.entitieId = entitieId;
    }
}

/**
 * on click action
 */
export class OnClickAction extends Action {
    position : Position;

    constructor(entitieId: string[], position: Position) {
        super(ActionType.onClick, "click", entitieId);
        this.position = position;
    }
}

/**
 * on key down action
 */
export class OnKeyDownAction extends Action {
    constructor(entitieId: string[], key: string) {
        super(ActionType.onKeyDown, key, entitieId);
    }
}

/**
 * on user action
 */
export abstract class OnUserAction extends Action {
    constructor(entitieId: string[]) {
        super(ActionType.onUserEvent, "userAction", entitieId);
    }
}
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
    onAction: (game: T, ctx: Context, action: Action) => [T, Context];
}

/**
 * the engine state
 */
export interface GameEngineState<T extends Game> {
    G: T;
    ctx: Context;
    onActionCallbacks: OnActionCallback<T>[];
}
