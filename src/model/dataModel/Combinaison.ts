import { compareForSuiteSort, getCombinaison } from "../scores/combinaisonDetect";
import { sort } from "../utils/sort";
import { Piece } from "./Piece";
import { CombiCalculated, NumeroVent } from "./dataUtils";


export enum CombinaisonExposeType {
    VISIBLE = "visible",
    HIDDEN = "hidden",
    HONNOR = "honnor"
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

    public readonly exposeType;

    public readonly combiCalculated : CombiCalculated[];

    /**
     * sort the numero of the piece if it is numero
     * @param pieces 
     */
    constructor(
        pieces : Piece[], 
        joueurVent : NumeroVent, 
        dominantVent : NumeroVent,
        exposeType : CombinaisonExposeType = CombinaisonExposeType.VISIBLE
    ) {
        this.pieces = pieces;
        this.exposeType = exposeType;
        sort<Piece>(this.pieces, compareForSuiteSort);
        this.combiCalculated = getCombinaison(this.pieces, joueurVent, dominantVent);
    }

    public isValid = () : boolean => {
        // joueur and dominant not important, so set to Est
        return isCombiValid(this.pieces, NumeroVent.Est, NumeroVent.Est);
    };
    
}