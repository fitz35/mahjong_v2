import { getSquaredDistanceBetweenTwoPositions, getUnitVector, multiplyVector } from "../../core/dataUtils";
import { Entity, Position } from "../../core/gameState/Entity";

export class AsteroidEntity extends Entity {
    constructor(id : string, position : Position) {
        super(id, 
            position, 
            multiplyVector(getUnitVector({x : Math.random() - 0.5, y : Math.random() - 0.5}), 50), 
            {x : 0, y: 0});
    }

    onDraw(ctx : CanvasRenderingContext2D) : void {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    onHitbox(positionClick : Entity | Position | Entity[]) : Entity[] {
        if(positionClick instanceof Entity) {
            return getSquaredDistanceBetweenTwoPositions(this.position, positionClick.position)
                    <= 20*20 ? 
                [this] : [];
        }else{
            return [];
        }
    }
}