import { MyLogger } from "../../../model/utils/logger";
import { getNorme, getUnitVectorTowardAnOther } from "../dataUtils";
import { Entity, Position } from "../gameState/Entity";

/**
 * a special entity with the objectif to rush a target
 */
export abstract class TargetEntity extends Entity {
    private static AREA = 10;


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
            return this.position.x >= this.target.x - TargetEntity.AREA &&
                    this.position.x <= this.target.x + TargetEntity.AREA &&
                    this.position.y >= this.target.y - TargetEntity.AREA &&
                    this.position.y <= this.target.y + TargetEntity.AREA; 
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

            MyLogger.debug(`${this.id} go to`, this.velocity);
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
                return super.updatePosition(timeElapsed);
            }else{
                return this;
            }
        }else{
            return super.updatePosition(timeElapsed);
        }
    }
}