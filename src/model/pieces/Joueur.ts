import { Combinaison } from "./Combinaison";
import { CombiAuth, Famille, isHonneurFamille, isSuiteFamille, MahjongScoring, NumeroVent } from "./types";

/**
 * check if the array of combinaison can be a color "pur" or only dragonAndVant
 * @param combinaisons the combinaisons to test
 * @param joueurVent the vent of the player
 * @param dominantVent the dominant vent
 * @returns the mahjongScoring if it is a color "pur" or only dragonAndVant, undefined otherwise
 */
export function isMahjongFullColor(combinaisons : Combinaison[], joueurVent : NumeroVent, dominant : NumeroVent) : MahjongScoring | undefined {
    const combi : CombiAuth | undefined = combinaisons[0].getCombinaison(joueurVent, dominant);
    if(combi !== undefined){
        let familleRef : Famille = combi.famille;
        //check if all the combinaison are the same Family
        let isSameFamily : boolean = true;

        for(let i = 1 ; i < combinaisons.length ; i++){
            const combi : CombiAuth | undefined = combinaisons[i].getCombinaison(joueurVent, dominant);
            if(combi === undefined){
                isSameFamily = false;
            }else{
                if(combi.famille !== familleRef && !isHonneurFamille(combi.famille)){
                    isSameFamily = false;
                }
            }
        }

        // if they are the same family, check the familly and apply the mahjong scoring
        if(isSameFamily){
            if(familleRef === Famille.Dragon || familleRef === Famille.Vent){
                return MahjongScoring.OnlyDragonAndVent;
            }else if(isSuiteFamille(familleRef)){
                return MahjongScoring.CouleurPur;
            }
        }
    }
    return undefined;
}

/**
 * test if the array of combinaison can be a trouble mahjong
 * @param combinaisons all the combinaison to test
 * @param joueurVent the vent of the player
 * @param dominant the dominant vent
 * @returns the mahjongScoring if it is a trouble mahjong, undefined otherwise
 */
export function isMahjongTrouble(combinaisons : Combinaison[], joueurVent : NumeroVent, dominant : NumeroVent) : MahjongScoring | undefined {
    const combi : CombiAuth | undefined = combinaisons[0].getCombinaison(joueurVent, dominant);
    if(combi !== undefined){
        let refFamille : Famille | undefined = undefined;
        let trouble : boolean = true;
        for(let i = 0 ; i < combinaisons.length ; i++){
            const combi : CombiAuth | undefined = combinaisons[i].getCombinaison(joueurVent, dominant);
            if(combi === undefined){
                trouble = false;
            }else{
                // don't take in consideration the honnor, the dragon and the vent
                if(!isHonneurFamille(combi.famille) && combi.famille !== Famille.Vent && combi.famille !== Famille.Dragon){
                    if(refFamille === undefined){
                        refFamille = combi.famille;
                    }else{
                        if(combi.famille !== refFamille){
                            trouble = false;
                        }
                    }
                }
            }
        }
        return trouble ? MahjongScoring.Trouble : undefined;
    }
    return undefined;
}

/**
 * get the mahjong scoring possible with the array of combinaison
 * @param combinaisons the combinaisons to test
 * @param joueurVent the vent of the player
 * @param dominant the dominant vent
 * @returns all the mahjong scoring possible
 */
export function getMahjongScoring(combinaisons : Combinaison[], joueurVent : NumeroVent, dominant : NumeroVent) : MahjongScoring[] {
    // if there is no combinaison, return an empty array
    if(combinaisons.length === 0){
        return [MahjongScoring.normal];
    }else{
        const mahjongScorings : MahjongScoring[] = [MahjongScoring.normal];
        const combi : CombiAuth | undefined = combinaisons[0].getCombinaison(joueurVent, dominant);
        if(combi !== undefined){
            
            return mahjongScorings;
        }else{
            return [MahjongScoring.normal];
        }
    }
    
}




export class Joueur {
    // take an array of combinaison, his vent, his name, an array of score for each manche
    constructor(public combinaisons: Array<Combinaison>, public vent: NumeroVent, public name: string, public scores: Array<number>) {
        this.combinaisons = combinaisons;
        this.vent = vent;
        this.name = name;
        this.scores = scores;
    }
}