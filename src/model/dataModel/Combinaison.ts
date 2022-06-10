import { compareForSuiteSort, getCombinaison } from "../scores/combinaisonDetect";
import { sort } from "../utils/sort";
import { Piece } from "./Piece";
import { CombiCalculated, NumeroVent } from "./dataUtils";
import { Expose, Transform, Type } from "class-transformer";


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
    @Expose()
    @Type(() => Piece)
    readonly pieces : Piece[];

    @Expose()
    @Transform(({ value }) => {return value as CombinaisonExposeType;}, { toClassOnly: true })
    public readonly exposeType;

    /**
     * sort the numero of the piece if it is numero
     * @param pieces 
     */
    constructor(pieces : Piece[], exposeType : CombinaisonExposeType = CombinaisonExposeType.VISIBLE) {
        this.pieces = pieces;
        this.exposeType = exposeType;
        sort<Piece>(this.pieces, compareForSuiteSort);
    }

    public isValid = () : boolean => {
        // joueur and dominant not important, so set to Est
        return isCombiValid(this.pieces, NumeroVent.Est, NumeroVent.Est);
    };

    public getCombinaison = (joueurVent : NumeroVent, dominantVent : NumeroVent) : CombiCalculated[] => {
        return getCombinaison(this.pieces, joueurVent, dominantVent);
    };
    
}