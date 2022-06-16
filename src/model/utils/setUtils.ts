
/**
 * compare two sets
 * @param set1 the first set
 * @param set2 the second set
 * @returns if the two sets are equal
 */
export function compareSet<T>(set1 : Set<T>, set2 : Set<T>) : boolean {
    if(set1.size !== set2.size){
        return false;
    }
    for(const elt of set1){
        if(!set2.has(elt)){
            return false;
        }
    }
    return true;
}

/**
 * 
 * @param array the array to check
 * @returns the array without undefined values
 */
export function eliminateUndefined<T>(array : (T | undefined)[]) : T[] {
    const result : T[] = [];
    for(const elt of array){
        if(elt !== undefined){
            result.push(elt);
        }
    }
    return result;
}