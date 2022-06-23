import { Entity, Position } from "./Entity";

/**
 * 
 * @param entities the entitie to test
 * @param position the position to test
 * @returns all the entity evolved from the position
 */
export function getInvolvedEntityIds(entities : Entity[], position : Position) : string[] {
    const entitiesId : string[] = [];
    for(const entity of entities){
        if(entity.position.x === position.x && entity.position.y === position.y){
            entitiesId.push(entity.id);
        }
    }
    return entitiesId;
}