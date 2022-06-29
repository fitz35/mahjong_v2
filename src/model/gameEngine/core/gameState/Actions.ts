import { Entity, Position } from "./Entity";

/**
 * the possible action to be done by the game engine
 */
export enum ActionType {
    onClick = "onClick",
    onKeyDown = "onKeyDown",
    onHitbox = "onHitbox",
    onReset = "onReset",

    onUserEvent = "onUserEvent",
    onAleaEvent = "onAleaEvent",
}

/**
 * an action
 */
export class Action {
    type: ActionType;
    payload: string;
    entitieId: Entity[];
    constructor(type: ActionType, payload: string, entitieId: Entity[]) {
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

    constructor(entitieId: Entity[], position: Position) {
        super(ActionType.onClick, "click", entitieId);
        this.position = position;
    }
}

/**
 * on key down action
 */
export class OnKeyDownAction extends Action {
    constructor(entitieId: Entity[], key: string) {
        super(ActionType.onKeyDown, key, entitieId);
    }
}

/**
 * on hitbox action
 */
export class OnHitboxAction extends Action {
    constructor(entitieId: Entity[]) {
        super(ActionType.onHitbox, "hitbox", entitieId);
    }
}

/**
 * on alea event
 */
export class OnAleaEventAction extends Action {
    constructor(entitieId: Entity[], id: string) {
        super(ActionType.onAleaEvent, "alea " + id, entitieId);
    }
}

/**
 * on user action
 */
export abstract class OnUserAction extends Action {
    constructor(entitieId: Entity[]) {
        super(ActionType.onUserEvent, "userAction", entitieId);
    }
}

/**
 * on reset action
 */
export class OnResetAction extends Action {
    constructor() {
        super(ActionType.onReset, "reset", []);
    }
}