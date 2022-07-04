import { checkHitbox, HitBoxCircleEntityInterface, HitboxEntityInterface, HitboxEntityType } from "../../core/entities/HitboxEntity";
import { TargetEntity } from "../../core/entities/TargetEntity";
import { Position } from "../../core/gameState/Entity";


export class PlayerEntity extends TargetEntity implements HitBoxCircleEntityInterface {
    
    radius = 10;

    constructor(
        id: string,
        position: Position,
        velocity: number
    ) {
        super(id, position, velocity);
    }

    hitboxType: HitboxEntityType.CIRCLE = HitboxEntityType.CIRCLE;

    onDraw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }


    onHitbox(toCheck : HitboxEntityInterface): boolean {
        return checkHitbox(this, toCheck);
    }
}
