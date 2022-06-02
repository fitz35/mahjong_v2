import { BaseCombi, ModificateurCombi } from "../dataModel/dataUtils";

export type CombiScoringRule = {
        id : number,
        name : string,
        open : number,
        hidden : number,
        multiplicator : number
        baseCombi : BaseCombi,
        modificateur : Array<ModificateurCombi>,
};

export type MahjongScoringRule = {
    id : number,
    name : string,
    open : number,
    canBeIdentified : boolean,
    multiplicator : number
};