import { getUnitVector, multiplyVector } from "../../core/dataUtils";
import { checkHitbox, HitBoxCircleEntityInterface, HitboxEntityInterface, HitboxEntityType } from "../../core/entities/HitboxEntity";
import { Entity, Position } from "../../core/gameState/Entity";

export class AsteroidEntity extends Entity implements HitBoxCircleEntityInterface {
    constructor(id : string, position : Position) {
        super(id, 
            position, 
            multiplyVector(getUnitVector({x : Math.random() - 0.5, y : Math.random() - 0.5}), 100), 
            {x : 0, y: 0});
    }
    hitboxType: HitboxEntityType.CIRCLE = HitboxEntityType.CIRCLE;
    radius = 10;
    onHitbox(hitboxTocheck: HitboxEntityInterface) : boolean{
        return checkHitbox(this, hitboxTocheck);
    }

    onDraw(ctx : CanvasRenderingContext2D) : void {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}