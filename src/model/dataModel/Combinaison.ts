import { compareForSuiteSort, getCombinaison } from "../scores/combinaisonDetect";
import { sort } from "../utils/sort";
import { Piece } from "./Piece";
import { CombiCalculated, isHonneurFamille, NumeroVent } from "./dataUtils";


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
export function isCombiValid(
    pieces : Piece[], 
    joueur : NumeroVent, 
    dominantVent : NumeroVent, 
    combinaisonType : CombinaisonExposeType
) : boolean {
    // if no piece, valid
    if(pieces.length >= 1){
        // check combinaison type
        let typeOk = true;
        for(const piece of pieces){
            if(combinaisonType === CombinaisonExposeType.VISIBLE || combinaisonType === CombinaisonExposeType.HIDDEN){
                // all ok except famille honnor
                if(isHonneurFamille(piece.famille)){
                    typeOk = false;
                    break;
                }
            }else{
                // only famille honnor is ok
                if(!isHonneurFamille(piece.famille)){
                    typeOk = false;
                    break;
                }
            }
        }
        if(typeOk){
        // if it is a combinaison, valid
            if(getCombinaison(pieces, joueur, dominantVent).length > 0){
                return true;
            }else{
                return false;
            }
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
        return isCombiValid(this.pieces, NumeroVent.Est, NumeroVent.Est, this.exposeType);
    };
    
    public pieceIsValidInCombi = (piece : Piece) : boolean => {
        return isCombiValid([...this.pieces, piece], NumeroVent.Est, NumeroVent.Est, this.exposeType);
    };
}