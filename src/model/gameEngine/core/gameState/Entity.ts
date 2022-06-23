/**
 * the position of the entitie
 */
export interface Position {
    x: number;
    y: number;
}

/**
 * the vitesse of the entitie (in pixel/second)
 */
export interface Velocity {
    x: number;
    y: number;
}

/**
 * the acceleration of the entitie (in pixel/second^2)
 */
export interface Acceleration {
    x: number;
    y: number;
}

/**
 * represente an entitie to be drawn on the screen
 */
export abstract class Entity {

    constructor(
        public readonly id: string, 
        public position: Position, 
        public velocity: Velocity, 
        public acceleration: Acceleration
    ) 
    {
        
    }

    /**
     * 
     * @param positionClick the position of the click
     * @returns if the entity is hit
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onHitbox(positionClick : Position | Entity[] | Entity) : Entity[] {
        return [];
    }

    /**
     * draw the entitie in the canvas
     * @param ctx the context of the canvas
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDraw(ctx : CanvasRenderingContext2D) : void {
        // nothing to do
    }

    /**
     * 
     * @param newVelocity the new velocity
     * @returns the new entitie
     */
    setVelocity(newVelocity : Velocity) : Entity {
        this.velocity = newVelocity;
        return this;
    }

    setAcceleration(newAcceleration : Acceleration) : Entity {
        this.acceleration = newAcceleration;
        return this;
    }

    setPosition(newPosition : Position) : Entity {
        this.position = {
            x : newPosition.x,
            y : newPosition.y
        };
        return this;
    }

    /**
    * 
    * @param entitie the entitie to be updated
    * @param timeElapsed the time elapsed since the last update in seconde
    * @returns the new position
    */
    updatePosition(timeElapsed : number) : Entity{
        return this.setPosition(
            {
                x : this.position.x + this.velocity.x * timeElapsed,
                y : this.position.y + this.velocity.y * timeElapsed
            }
        );
    }


    /**
     * 
     * @param timeElapsed the time elapsed since the last update in seconde
     * @returns the new velocity
     */
    updateVelocity(timeElapsed : number) : Entity {
        return this.setVelocity(
            {
                x : this.velocity.x + this.acceleration.x * timeElapsed,
                y : this.velocity.y + this.acceleration.y * timeElapsed,
            }
        );
    }

}