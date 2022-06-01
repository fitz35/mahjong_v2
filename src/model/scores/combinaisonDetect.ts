import { Piece } from "../dataModel/Piece";
import {
    BaseCombi,
    CombiCalculated,
    convertHonneurNumberToVentNumber,
    Famille,
    isHonneurFamille,
    isSuiteFamille,
    ModificateurCombi,
    NumeroVent,
} from "../dataModel/dataUtils";
import { sort } from "../utils/sort";

/**
 * compare 2 piece to sort it for isSuite function
 * If no numero (dragon, vent), it is greater than the other
 * @param piece1
 * @param piece2
 */
export function compareForSuiteSort(piece1: Piece, piece2: Piece): number {
    if (!isSuiteFamille(piece1.famille) && !isSuiteFamille(piece2.famille)) {
        return 0; // no sortable
    } else if (
        !isSuiteFamille(piece1.famille) &&
    isSuiteFamille(piece2.famille)
    ) {
        return 1;
    } else if (
        isSuiteFamille(piece1.famille) &&
    !isSuiteFamille(piece2.famille)
    ) {
        return -1;
    } else {
    // compare the numero
        if (Number(piece1.numero) > Number(piece2.numero)) return 1;
        else if (Number(piece1.numero) === Number(piece2.numero)) return 0;
        else return -1;
    }
}

/**
 * test if all the pieces are the famille
 * @param pieces the pieces to tests
 * @returns if the pieces are empty, return true
 */
function isSameFamille(pieces: Piece[]): boolean {
    if (pieces.length !== 0) {
        const familleRef: Famille = pieces[0].famille;
        let sameFamille = true;

        for (let i = 1; i < pieces.length; i++) {
            sameFamille = sameFamille && familleRef === pieces[i].famille;
        }
        return sameFamille;
    } else {
        return true;
    }
}

//function to test if the piece in a array arent the same
function isNotSame(pieces: Piece[]): boolean {
    let notSame = true;
    for (let i = 0; i < pieces.length; i++) {
        for (let j = i + 1; j < pieces.length; j++) {
            notSame =
        notSame &&
        (pieces[i].numero !== pieces[j].numero ||
          pieces[i].famille !== pieces[j].famille);
        }
    }
    return notSame;
}

/**
 * @param pieces
 * @returns if the pieces are a suite. If 0 piece, false, if 1 false, if 2 false, if 3 test
 */
export function isSuite(pieces: Piece[]): CombiCalculated | undefined {
    sort<Piece>(pieces, compareForSuiteSort);
    if (pieces.length >= 3) {
    // cant be a suite if it isn't a same famille combinaison and a famille without suite
        if (isSameFamille(pieces) && isSuiteFamille(pieces[0].famille)) {
            let allFollow = true;
            for (let i = 0; i < pieces.length - 1; i++) {
                allFollow =
          allFollow &&
          Number(pieces[i].numero) === Number(pieces[i + 1].numero) - 1;
            }
            if (allFollow) {
                return {
                    base: BaseCombi.Suite,
                    modificateur: new Set(),
                    famille: pieces[0].famille,
                };
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

/**
 * test if a combinaison is a carre, brelan or pair
 * @param pieces the pieces to test
 * @param joueurVent the joueur who hold the combi
 * @param dominantVent the dominant wind
 * @returns
 */
export function isMultipleSamePiece(
    pieces: Piece[],
    joueurVent: NumeroVent,
    dominantVent: NumeroVent
): CombiCalculated | undefined {
    if (
        (pieces.length === 4 || pieces.length === 3 || pieces.length === 2) &&
    pieces[0].famille !== Famille.Fleurs &&
    pieces[0].famille !== Famille.Saison
    ) {
        const familleRef: Famille = pieces[0].famille;
        const numeroRef: string = pieces[0].numero;
        let sameFamille = true;
        let sameNumero = true;

        for (let i = 1; i < pieces.length; i++) {
            sameFamille = sameFamille && familleRef === pieces[i].famille;
            sameNumero = sameNumero && numeroRef === pieces[i].numero;
        }

        let baseCombi: BaseCombi;
        switch (pieces.length) {
        case 2:
            baseCombi = BaseCombi.Paire;
            break;
        case 3:
            baseCombi = BaseCombi.Brelan;
            break;
        case 4:
            baseCombi = BaseCombi.Carre;
            break;
        default:
            baseCombi = BaseCombi.Carre;
        }

        if (sameFamille && sameNumero) {
            if (isSuiteFamille(familleRef)) {
                // can be a Extrem carre
                if (numeroRef === "1" || numeroRef === "9") {
                    return {
                        base: baseCombi,
                        modificateur: new Set([ModificateurCombi.ExtremNumero]),
                        famille: familleRef,
                    };
                } else {
                    return {
                        base: baseCombi,
                        modificateur: new Set(),
                        famille: familleRef,
                    };
                }
            } else {
                // can be joueur or dominant
                const modificateur: Set<ModificateurCombi> = new Set();
                if (familleRef === Famille.Vent || familleRef === Famille.Dragon) {
                    modificateur.add(ModificateurCombi.VentOuDragon);
                }
                if (familleRef === Famille.Vent && numeroRef === joueurVent) {
                    modificateur.add(ModificateurCombi.Joueur);
                }
                if (familleRef === Famille.Vent && numeroRef === dominantVent) {
                    modificateur.add(ModificateurCombi.Dominant);
                }

                return {
                    base: baseCombi,
                    modificateur: modificateur,
                    famille: familleRef,
                };
            }
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}

// test if a combinaison is all honneur
export function isHonneur(
    pieces: Piece[],
    joueur: NumeroVent
): CombiCalculated[]{
    if (
        pieces.length > 0 &&
    pieces.length <= 4 &&
    isSameFamille(pieces) &&
    isNotSame(pieces) &&
    isHonneurFamille(pieces[0].famille)
    ) {
        // if we have 4 pieces : it is a carre and a joueur honneur
        if (pieces.length === 4) {
            return [{
                base: BaseCombi.Honneur,
                modificateur: new Set([ModificateurCombi.Joueur, ModificateurCombi.HonneurCarre]),
                famille: pieces[0].famille,
            }];
        } else {
            // for each piece we test if it is a joueur honneur and we genere a combi
            let isJoueur = false;
            const combiCalculated: CombiCalculated[] = [];
            for (let i = 0; i < pieces.length; i++) {
                if (convertHonneurNumberToVentNumber(pieces[i].numero) === joueur) {
                    isJoueur = true;
                }
                combiCalculated.push({
                    base: BaseCombi.Honneur,
                    modificateur: new Set(),
                    famille: pieces[i].famille
                });
            }

            // if it is a playeur we had a player honneur
            if (isJoueur) {
                combiCalculated[combiCalculated.length - 1].modificateur.add(ModificateurCombi.Joueur);
            }
           
            return combiCalculated;
        }
    } else {
        return [];
    }
}

// test if an array of pieces is a combinaison and get the combinaison
export function getCombinaison(
    pieces: Piece[],
    joueurVent: NumeroVent,
    dominantVent: NumeroVent
): CombiCalculated[] {
    const combiAuth: CombiCalculated | undefined = isMultipleSamePiece(
        pieces,
        joueurVent,
        dominantVent
    );
    if (combiAuth !== undefined) {
        return [combiAuth];
    } else {
        const combiAuth: CombiCalculated | undefined = isSuite(pieces);
        if (combiAuth !== undefined) {
            return [combiAuth];
        } else {
            const combiAuth: CombiCalculated[] = isHonneur(
                pieces,
                joueurVent
            );
            return combiAuth;
        }
    }
}
