import { getSquaredDistanceBetweenTwoPositions } from "../dataUtils";
import { Position } from "../gameState/Entity";

export enum HitboxEntityType {
    CIRCLE,
    SQUARE
}


export interface HitboxEntityInterface {
    hitboxType: HitboxEntityType;
    position : Position;
    onHitbox : (hitboxTocheck : HitboxEntityInterface) => boolean;
}

export interface HitBoxCircleEntityInterface extends HitboxEntityInterface {
    hitboxType : HitboxEntityType.CIRCLE;
    radius : number;
}

export interface HitBoxSquareEntityInterface extends HitboxEntityInterface {
    hitboxType : HitboxEntityType.SQUARE;
    width : number;
    height : number;
}

export function checkCircleHitbox(hit1 : HitBoxCircleEntityInterface, hit2 : HitBoxCircleEntityInterface) : boolean {
    const distance = Math.sqrt(
        Math.pow(hit1.position.x - hit2.position.x, 2) + 
        Math.pow(hit1.position.y - hit2.position.y, 2)
    );
    return distance < hit1.radius + hit2.radius;
}

export function checkSquareHitbox(hit1 : HitBoxSquareEntityInterface, hit2 : HitBoxSquareEntityInterface) : boolean {
    return (
        hit1.position.x + hit1.width > hit2.position.x &&
        hit1.position.x < hit2.position.x + hit2.width &&
        hit1.position.y + hit1.height > hit2.position.y &&
        hit1.position.y < hit2.position.y + hit2.height
    );
}

export function checkCircleAndSquareHitbox(
    hit1 : HitBoxCircleEntityInterface, 
    hit2 : HitBoxSquareEntityInterface
) : boolean {
    const distance = Math.sqrt(
        Math.pow(hit1.position.x - hit2.position.x, 2) + 
        Math.pow(hit1.position.y - hit2.position.y, 2)
    );
    return distance < hit1.radius + hit2.width / 2;
}

/**
 * 
 * @param hit1 the first hitbox
 * @param hit2 the second hitbox
 * @returns if the two hitbox are colliding
 */
export function checkHitbox(hit1 : HitboxEntityInterface, hit2 : HitboxEntityInterface) : boolean {
    const distance = getSquaredDistanceBetweenTwoPositions(hit1.position, hit2.position);
    if(hit1.hitboxType === HitboxEntityType.CIRCLE) {
        const hit1Circle = hit1 as HitBoxCircleEntityInterface;
        if(hit2.hitboxType === HitboxEntityType.CIRCLE) {
            const hit2Circle = hit2 as HitBoxCircleEntityInterface;
            return checkCircleHitbox(hit1Circle, hit2Circle);
        }else{
            const hit2Square = hit2 as HitBoxSquareEntityInterface;
            if(hit1Circle.radius + Math.max(hit2Square.width, hit2Square.height) > Math.sqrt(distance)) {
                return checkCircleAndSquareHitbox(hit1Circle, hit2Square);
            }else{
                return false;
            }
        }
    }else{
        const hit1Square = hit1 as HitBoxSquareEntityInterface;
        if(hit2.hitboxType === HitboxEntityType.CIRCLE) {
            const hit2Circle = hit2 as HitBoxCircleEntityInterface;
            if(hit2Circle.radius + Math.max(hit1Square.width, hit1Square.height) > Math.sqrt(distance)) {
                return checkCircleAndSquareHitbox(hit2Circle, hit1Square);
            }else{
                return false;
            }
        }else{
            const hit2Square = hit2 as HitBoxSquareEntityInterface;
            if(Math.max(hit1Square.width, hit1Square.height) + 
                Math.max(hit2Square.width, hit2Square.height) > Math.sqrt(distance)) {
                return checkSquareHitbox(hit1Square, hit2Square);
            }else{
                return false;
            }
        }
    }
}