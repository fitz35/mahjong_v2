import { getNorme, getUnitVectorTowardAnOther } from "../dataUtils";
import { Entity, Position } from "../gameState/Entity";

/**
 * a special entity with the objectif to rush a target
 */
export abstract class TargetEntity extends Entity {
    private static AREA = 0;


    public baseVelocity : number;
    public target : Position | undefined;

    constructor(
        id : string, 
        basePosition : Position,
        baseVelocity : number, 
        target : Position | undefined = undefined
    ){
        super(id, basePosition, {x : 0, y : 0}, {x : 0, y : 0});
        this.baseVelocity = baseVelocity;
        this.target = target;
    }

    /**
     * 
     * @returns if the entity has rush the target
     */
    private isArrival() : boolean {
        if(this.target === undefined){
            return false;
        }else{
            return (Math.ceil(this.position.x) >= this.target.x - TargetEntity.AREA &&
                    Math.ceil(this.position.x) <= this.target.x + TargetEntity.AREA &&
                    Math.ceil(this.position.y) >= this.target.y - TargetEntity.AREA &&
                    Math.ceil(this.position.y) <= this.target.y + TargetEntity.AREA) ||
                    (Math.floor(this.position.x) >= this.target.x - TargetEntity.AREA &&
                    Math.floor(this.position.x) <= this.target.x + TargetEntity.AREA &&
                    Math.floor(this.position.y) >= this.target.y - TargetEntity.AREA &&
                    Math.floor(this.position.y) <= this.target.y + TargetEntity.AREA); 
        }
    }

    /**
     * launch the entity
     */
    public go() {
        if(this.target !== undefined){
            const unitVector = getUnitVectorTowardAnOther(this.position, this.target);
            this.velocity = {
                x : unitVector.x * this.baseVelocity,
                y : unitVector.y * this.baseVelocity,
            };

        }
    }

    /**
     * stop the entity
     */
    public stop() {
        this.velocity = {
            x : 0,
            y : 0
        };
    }

    /**
     * set the target
     * @param position the new target 
     */
    public setTarget(position : Position | undefined) {
        this.target = position;
        // if the target and the velocity is set, the entity must go
        if(getNorme(this.velocity) !== 0){
            this.go();
        }
    }

    /**
     * 
     * @param timeElapsed the time elapsed since the last update
     * @returns the new entity
     */
    public updatePosition(timeElapsed: number): Entity {
        if(this.target !== undefined){
            if(!this.isArrival()){
                this.go(); // recalcul the destination (avoid the error of the rounding)
                return super.updatePosition(timeElapsed);
            }else{
                return this;
            }
        }else{
            return super.updatePosition(timeElapsed);
        }
    }
}