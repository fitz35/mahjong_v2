import { Entity, Position } from "./Entity";

/**
 * 
 * @param entities the entitie to test
 * @param position the position to test
 * @returns all the entity evolved from the position
 */
export function getInvolvedEntity(entities : Entity[], position : Position) : Entity[] {
    const entitiesId : Entity[] = [];
    for(const entity of entities){
        if(entity.position.x === position.x && entity.position.y === position.y){
            entitiesId.push(entity);
        }
    }
    return entitiesId;
}