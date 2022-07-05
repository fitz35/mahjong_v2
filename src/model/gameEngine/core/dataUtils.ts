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
 * 
 * @param vector the vector
 * @returns the unit vector
 */
export function getUnitVector<T extends {x : number, y : number}>(vector : T) : {x : number, y : number} {
    const norme = getNorme(vector);
    return {
        x : vector.x/norme,
        y : vector.y/norme
    };
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
    return getUnitVector({x, y});
}

/**
 * 
 * @param vector the vector
 * @param factor the factor to multiply the vector by
 * @returns the vector multiplied by the factor
 */
export function multiplyVector
<T extends {x : number, y : number}>
(vector: T, factor: number): {x : number, y : number} {
    return {
        x : vector.x * factor,
        y : vector.y * factor
    };
}

/**
 * 
 * @param from the position to get the unit vector from
 * @param to the position to get the unit vector to
 * @returns the squarred distance
 */
export function getSquaredDistanceBetweenTwoPositions(from: Position, to: Position): number {
    const x = to.x - from.x;
    const y = to.y - from.y;
    return x*x + y*y;
}