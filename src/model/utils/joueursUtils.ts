/**
 * 
 * @param joueurs an object containing the joueurs
 * @returns a generator of the joueurs
 */
export function* getJoueurGenerator<
    X,
    T extends { joueur1: X; joueur2: X; joueur3: X; joueur4: X }
>(joueurs: T): IterableIterator<X> {
    for (let i = 0; i < 4; i++) {
        if (i === 0) {
            yield joueurs.joueur1;
        } else if (i === 1) {
            yield joueurs.joueur2;
        } else if (i === 2) {
            yield joueurs.joueur3;
        } else if (i === 3) {
            yield joueurs.joueur4;
        }else{
            return;
        }
    }
    return;
}
