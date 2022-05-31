import { sort } from "../utils/sort";
import { Piece } from "./Piece";
import { BaseCombi, CombiAuth, convertHonneurNumberToVentNumber, Famille, isHonneurFamille, isSuiteFamille, ModificateurCombi, NumeroVent } from "./piecesUtils";

/**
 * compare 2 piece to sort it for isSuite function
 * If no numero (dragon, vent), it is greater than the other
 * @param piece1 
 * @param piece2 
 */
export function compareForSuiteSort(piece1 : Piece, piece2 : Piece) : number {
    if(!isSuiteFamille(piece1.famille) && !isSuiteFamille(piece2.famille)){
        return 0; // no sortable
    }else if (!isSuiteFamille(piece1.famille) && isSuiteFamille(piece2.famille)){
        return 1;
    }else if (isSuiteFamille(piece1.famille) && !isSuiteFamille(piece2.famille)){
        return -1;
    }else{
        // compare the numero
        if(Number(piece1.numero) > Number(piece2.numero))
            return 1;
        else if(Number(piece1.numero) === Number(piece2.numero))
            return 0;
        else
            return -1;
    }
}

/**
 * test if all the pieces are the famille
 * @param pieces the pieces to tests
 * @returns 
 */
function isSameFamille(pieces : Piece[]) : boolean {
    const familleRef : Famille = pieces[0].famille;
    let sameFamille = true;

    for(let i = 1 ; i < pieces.length ; i ++){
        sameFamille = sameFamille && familleRef === pieces[i].famille
    }
    return sameFamille;
}

//function to test if the piece in a array arent the same
function isNotSame(pieces : Piece[]) : boolean {
    let notSame = true; 
    for(let i = 0 ; i < pieces.length ; i ++){
        for(let j = i + 1 ; j < pieces.length ; j ++){
            notSame = notSame && (pieces[i].numero !== pieces[j].numero || pieces[i].famille !== pieces[j].famille); 
        }
    }
    return notSame;
}

/**
 * @param pieces 
 * @returns if the pieces are a suite. If 0 piece, false, if 1 false, if 2 false, if 3 test
 */
export function isSuite(pieces : Piece[]) : CombiAuth | undefined{
    sort<Piece>(pieces, compareForSuiteSort);
    if(pieces.length >= 3){
        // cant be a suite if it isn't a same famille combinaison and a famille without suite
        if(isSameFamille(pieces) && isSuiteFamille(pieces[0].famille)){
            let allFollow = true;
            for(let i : number = 0; i < pieces.length - 1; i ++){
                allFollow = allFollow && (
                    Number(pieces[i].numero) === Number(pieces[i + 1].numero) - 1
                );
            }
            if(allFollow){
                return {
                    base : BaseCombi.Suite,
                    modificateur : new Set(),
                    famille : pieces[0].famille,
                };
            }else{
                return undefined;
            }
        }else{
            return undefined;
        }

    }else{
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
export function isMultipleSamePiece (pieces : Piece[], joueurVent : NumeroVent, dominantVent : NumeroVent) : CombiAuth | undefined {
    if((pieces.length === 4 || pieces.length === 3 || pieces.length === 2) && pieces[0].famille !== Famille.Fleurs && pieces[0].famille !== Famille.Saison){
        const familleRef : Famille = pieces[0].famille;
        const numeroRef : string = pieces[0].numero;
        let sameFamille = true;
        let sameNumero = true;

        for(let i = 1 ; i < pieces.length ; i ++){
            sameFamille = sameFamille && familleRef === pieces[i].famille
            sameNumero = sameNumero && numeroRef === pieces[i].numero
        }

        let baseCombi : BaseCombi;
        switch(pieces.length){
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


        if(sameFamille && sameNumero){
            if(isSuiteFamille(familleRef)){// can be a Extrem carre
                if(numeroRef === "1" || numeroRef === "9"){
                    return {
                        base : baseCombi,
                        modificateur : new Set([ModificateurCombi.ExtremNumero]),
                        famille : familleRef
                    };
                }else{
                    return {
                        base : baseCombi,
                        modificateur : new Set(),
                        famille : familleRef
                    };
                }
            }else{// can be joueur or dominant
                let modificateur : Set<ModificateurCombi> = new Set();
                if(familleRef === Famille.Vent || familleRef === Famille.Dragon){
                    modificateur.add(ModificateurCombi.VentOuDragon);
                }
                if(familleRef === Famille.Vent && numeroRef === joueurVent){
                    modificateur.add(ModificateurCombi.Joueur);
                }
                if(familleRef === Famille.Vent && numeroRef === dominantVent){
                    modificateur.add(ModificateurCombi.Dominant);
                }

                return {
                    base : baseCombi,
                    modificateur : modificateur,
                    famille : familleRef
                };
            }
        }else{
            return undefined;
        }
    }else{
        return undefined;
    }
}

// test if a combinaison is all honneur
export function isHonneur(pieces : Piece[], joueur : NumeroVent) : CombiAuth | undefined {
    if(pieces.length <= 4 && isSameFamille(pieces) && isNotSame(pieces) && isHonneurFamille(pieces[0].famille)){
        const modificateur : Set<ModificateurCombi> = new Set();

        // check the vent of the joueur
        
        for(let i = 0 ; i < pieces.length ; i ++){
            if(convertHonneurNumberToVentNumber(pieces[i].numero) === joueur){
                modificateur.add(ModificateurCombi.Joueur);
            }
        }
        
        // check if this is a carre
        if(pieces.length === 4){
            modificateur.add(ModificateurCombi.HonneurCarre);
        }

        return {
            base : BaseCombi.Honneur,
            modificateur : modificateur,
            famille : pieces[0].famille,
            number : pieces.length
        };
    }else{
        return undefined;
    }
}

// test if an array of pieces is a combinaison and get the combinaison
export function getCombinaison(pieces : Piece[], joueurVent : NumeroVent, dominantVent : NumeroVent) : CombiAuth | undefined {
    const combiAuth : CombiAuth | undefined = isMultipleSamePiece(pieces, joueurVent, dominantVent);
    if(combiAuth !== undefined){
        return combiAuth;
    }else{
        const combiAuth : CombiAuth | undefined = isSuite(pieces);
        if(combiAuth !== undefined){
            return combiAuth;
        }else{
            const combiAuth : CombiAuth | undefined = isHonneur(pieces, joueurVent);
            if(combiAuth !== undefined){
                return combiAuth;
            }else{
                return undefined;
            }
        }
    }
}



/**
 * 
 * @param pieces the pieces to tests
 * @return if the pieces are a valid combinaison
 */
export function isCombiValid(pieces : Piece[], joueur : NumeroVent, dominantVent : NumeroVent) : boolean {
    // if no piece, valid
    if(pieces.length >= 1){
        // if it is a combinaison, valid
        if(getCombinaison(pieces, joueur, dominantVent) !== undefined){
            return true;
        }else{
            return false;
        }
    }else{
        return true;
    }
}

/**
 * represente a combinaison of multiple piece, and some usefull function
 */
export class Combinaison {
    readonly pieces : Piece[];

    /**
     * sort the numero of the piece if it is numero
     * @param pieces 
     */
    constructor(pieces : Piece[]){
        this.pieces = pieces;
        sort<Piece>(this.pieces, compareForSuiteSort);
    }

    public isValid = () : boolean => {
        // joueur and dominant not important, so set to Est
        return isCombiValid(this.pieces, NumeroVent.Est, NumeroVent.Est);
    }

    public getCombinaison = (joueurVent : NumeroVent, dominantVent : NumeroVent) : CombiAuth | undefined => {
        return getCombinaison(this.pieces, joueurVent, dominantVent);
    }
    
}