import { TargetEntity } from "../../core/entities/TargetEntity";
import { Entity, Position } from "../../core/gameState/Entity";


export class PlayerEntity extends TargetEntity {

    constructor(
        id: string,
        position: Position,
        velocity: number
    ) {
        super(id, position, velocity);
    }

    onDraw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, 10, 10);
        ctx.fill();
        ctx.closePath();
    }


    onHitbox(positionClick: Entity | Position | Entity[]): Entity[] {
        if (positionClick instanceof Array) {
            const hit : Entity[] = [];
            for(const entity of positionClick) {
                if (entity.onHitbox(this).length > 0) {
                    hit.push(entity);
                }
            }
            return hit;
        }else{
            return [];
        }
    }
}