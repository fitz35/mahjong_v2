import { checkHitbox, HitBoxCircleEntityInterface, HitboxEntityInterface, HitboxEntityType } from "../../core/entities/HitboxEntity";
import { Entity } from "../../core/gameState/Entity";

export class FuelEntity extends Entity implements HitBoxCircleEntityInterface {
    constructor(id : string) {
        super(id, 
            {x : Math.ceil(Math.random()*500), y : Math.ceil(Math.random()*500)}, 
            {x : 0, y: 0}, 
            {x : 0, y: 0});
    }
    hitboxType: HitboxEntityType.CIRCLE = HitboxEntityType.CIRCLE;
    radius = 10;
    
    onHitbox (hitboxTocheck: HitboxEntityInterface) : boolean{
        return checkHitbox(this, hitboxTocheck);
    }

    onDraw(ctx : CanvasRenderingContext2D) : void {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

}