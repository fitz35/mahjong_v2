import { getUnitVector, multiplyVector } from "../../core/dataUtils";
import { Entity, Position } from "../../core/gameState/Entity";

export class AsteroidEntity extends Entity {
    constructor(id : string) {
        super(id, 
            {x : Math.ceil(Math.random()*500), y : Math.ceil(Math.random()*500)}, 
            multiplyVector(getUnitVector({x : Math.random() - 0.5, y : Math.random() - 0.5}), 50), 
            {x : 0, y: 0});
    }

    onDraw(ctx : CanvasRenderingContext2D) : void {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y, 10, 10);
        ctx.fill();
        ctx.closePath();
    }

    onHitbox(positionClick : Entity | Position | Entity[]) : Entity[] {
        if(positionClick instanceof Entity) {
            
            return this.position.x < positionClick.position.x && 
                this.position.x + 10 > positionClick.position.x && 
                this.position.y < positionClick.position.y + 10 && 
                this.position.y + 10 > positionClick.position.y ? 
                [positionClick] : [];
        }else{
            return [];
        }
    }
}