import { getUnitVectorTowardAnOther, multiplyVector } from "../../core/dataUtils";
import { checkHitbox, HitBoxCircleEntityInterface, HitboxEntityInterface, HitboxEntityType } from "../../core/entities/HitboxEntity";
import { Entity, Position } from "../../core/gameState/Entity";

export class LaserEntity extends Entity implements HitBoxCircleEntityInterface {
    start : Position;

    radius = 1;
    constructor(id: string, start : Position, target : Position) {
        super(id, start, multiplyVector(getUnitVectorTowardAnOther(start, target), 800), { x: 0, y: 0 });
        this.start = start;
    }

    hitboxType: HitboxEntityType.CIRCLE = HitboxEntityType.CIRCLE;
    onHitbox(hitboxTocheck: HitboxEntityInterface) : boolean {
        return checkHitbox(this, hitboxTocheck);
    }

    onDraw(ctx: CanvasRenderingContext2D) : void {
        const vector = multiplyVector(getUnitVectorTowardAnOther(this.position, this.start), 10);
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 4;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + vector.x, this.position.y + vector.y);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fill();
        ctx.closePath();
    }
}