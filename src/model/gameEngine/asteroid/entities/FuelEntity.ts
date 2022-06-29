import { Entity, Position } from "../../core/gameState/Entity";

export class FuelEntity extends Entity {
    constructor(id : string) {
        super(id, 
            {x : Math.ceil(Math.random()*500), y : Math.ceil(Math.random()*500)}, 
            {x : 0, y: 0}, 
            {x : 0, y: 0});
    }

    onDraw(ctx : CanvasRenderingContext2D) : void {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    onHitbox(positionClick : Entity | Position | Entity[]) : Entity[] {
        if(positionClick instanceof Entity) {
            
            return (positionClick.position.x - this.position.x) * (positionClick.position.x - this.position.x) + 
                    (positionClick.position.y - this.position.y) * (positionClick.position.y - this.position.y) 
                    <= 20*20 ? 
                [this] : [];
        }else{
            return [];
        }
    }

}