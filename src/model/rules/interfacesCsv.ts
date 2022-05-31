import { BaseCombi, ModificateurCombi } from "../pieces/piecesUtils";

export type CombiScoringRules = {
        id : number,
        name : string,
        open : number,
        hidden : number,
        multiplicator : number
        baseCombi : BaseCombi,
        modificateur : Array<ModificateurCombi>,
};

export type MahjongScoringRules = {
    id : number,
    name : string,
    open : number,
    hidden : number,
    multiplicator : number
};