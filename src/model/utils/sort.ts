/**
 * sort an array with create a new
 * @param toSort the array to sort
 * @param compaFunction the comparaison function of the element
 */
export function sort<T>(toSort : T[], compaFunction : (elt1 : T, elt2 : T) => number) : void {
    for(let actu = 0 ; actu < toSort.length - 1 ; actu ++){
        for(let cursor = actu + 1 ; cursor < toSort.length ; cursor++){
            if(compaFunction(toSort[actu], toSort[cursor]) > 0){
                const temp = toSort[cursor];
                toSort[cursor] = toSort[actu];
                toSort[actu] = temp;
            }
        }
    }
}