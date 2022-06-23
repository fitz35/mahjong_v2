import { Position } from "./Entity";

/**
 * the possible action to be done by the game engine
 */
export enum ActionType {
    onClick = "onClick",
    onKeyDown = "onKeyDown",
    onHitbox = "onHitbox",
    onUserEvent = "onUserEvent",
    onAleaEvent = "onAleaEvent",
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
 * on hitbox action
 */
export class OnHitboxAction extends Action {
    constructor(entitieId: string[]) {
        super(ActionType.onHitbox, "hitbox", entitieId);
    }
}

/**
 * on alea event
 */
export class OnAleaEventAction extends Action {
    constructor(entitieId: string[], id: string) {
        super(ActionType.onAleaEvent, "alea " + id, entitieId);
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