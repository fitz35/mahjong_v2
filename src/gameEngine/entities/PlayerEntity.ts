import { TargetEntity } from "../core/entities/TargetEntity";
import { Position } from "../core/gameState/Entity";


export class PlayerEntity extends TargetEntity {

    constructor(
        id: string,
        position: Position,
        velocity: number
    ) {
        super(id, position, velocity);
    }

    onDraw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "red";
        ctx.fillRect(Math.ceil(this.position.x), Math.ceil(this.position.y), 10, 10);
    }

}