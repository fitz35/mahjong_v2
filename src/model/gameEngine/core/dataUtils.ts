import { Position } from "./gameState/Entity";

/**
 * 
 * @param vector the vector
 * @returns the norme of the vector
 */
export function getNorme<T extends {x : number, y : number}>(vector : T) : number {
    return Math.sqrt(vector.x*vector.x + vector.y*vector.y);
}

/**
 * get the unit vector of a position to another
 * @param from the position to get the unit vector from
 * @param to the position to get the unit vector to
 * @returns the unit vector
 */
export function getUnitVectorTowardAnOther(from: Position, to: Position): Position {
    const x = to.x - from.x;
    const y = to.y - from.y;
    const length = getNorme({x, y});
    return {
        x: x / length,
        y: y / length,
    };
}

