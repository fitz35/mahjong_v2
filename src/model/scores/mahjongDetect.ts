import { Combinaison } from "../dataModel/Combinaison";
import { 
    BaseCombi, 
    CombiCalculated, 
    Famille, 
    isHonneurFamille, 
    isSuiteFamille, 
    MahjongScoring, 
    ModificateurCombi,
    NumeroVent } from "../dataModel/dataUtils";

/**
 * check if the array of combinaison can be a color "pur" or only dragonAndVant
 * @param combinaisons the combinaisons to test
 * @param joueurVent the vent of the player
 * @param dominantVent the dominant vent
 * @returns the mahjongScoring if it is a color "pur" or only dragonAndVant, undefined otherwise
 */
export function isMahjongFullColor(combinaisons : Combinaison[], joueurVent : NumeroVent, dominant : NumeroVent) : MahjongScoring | undefined {
    if(combinaisons.length !== 0){
        const combi : CombiCalculated | undefined = combinaisons[0].getCombinaison(joueurVent, dominant);
        if(combi !== undefined){
            const familleRef : Famille = combi.famille;
            //check if all the combinaison are the same Family
            let isSameFamily  = true;

            for(let i = 1 ; i < combinaisons.length ; i++){
                const combi : CombiCalculated | undefined = combinaisons[i].getCombinaison(joueurVent, dominant);
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
    if(combinaisons.length !== 0){
        const combi : CombiCalculated | undefined = combinaisons[0].getCombinaison(joueurVent, dominant);
        if(combi !== undefined){
            let refFamille : Famille | undefined = undefined;
            let trouble  = true;
            for(let i = 0 ; i < combinaisons.length ; i++){
                const combi : CombiCalculated | undefined = combinaisons[i].getCombinaison(joueurVent, dominant);
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
    }
    return undefined;
    
}

/**
 * test if the array of combinaison can be a mahjong ofonly pair, only brelan or only suite
 * @param combinaisons all the combinaison to test
 * @param joueurVent the vent of the player
 * @param dominant the dominant vent
 * @returns the mahjongScoring if it is a full brelan, a full pair or a full suite, undefined otherwise
 */
export function isMahjongPairBrelanSuite(combinaisons : Combinaison[], joueurVent : NumeroVent, dominant : NumeroVent) : MahjongScoring | undefined {
    if(combinaisons.length !== 0){
        const combi : CombiCalculated | undefined = combinaisons[0].getCombinaison(joueurVent, dominant);
        if(combi !== undefined){
            let isPair  = true;
            let isBrelan  = true;
            let isSuite  = true;
            for(let i = 0 ; i < combinaisons.length ; i++){
                const combi : CombiCalculated | undefined = combinaisons[i].getCombinaison(joueurVent, dominant);
                if(combi === undefined){
                    isPair = false;
                    isBrelan = false;
                    isSuite = false;
                }else{
                    // don't take in consideration the honnor
                    if(!isHonneurFamille(combi.famille)){
                        if(combi.base !== BaseCombi.Paire){
                            isPair = false;
                        }
                        if(combi.base !== BaseCombi.Brelan && combi.base !== BaseCombi.Carre){
                            isBrelan = false;
                        }
                        if(combi.base !== BaseCombi.Suite){
                            isSuite = false;
                        }
                        
                    }
                }
            }
            if(isPair){
                return MahjongScoring.OnlyPaire;
            }else if(isBrelan){
                return MahjongScoring.OnlyBrelan;
            }else if(isSuite){
                return MahjongScoring.OnlySuite;
            }
        }
    }
    return undefined;
}

/**
 * test if the array of combinaison can be a mahjong of only 1 or 9
 */
export function isMahjongOnly1or9(combinaisons : Combinaison[], joueurVent : NumeroVent, dominant : NumeroVent) : MahjongScoring | undefined {
    if(combinaisons.length !== 0){
        const combi : CombiCalculated | undefined = combinaisons[0].getCombinaison(joueurVent, dominant);
        if(combi !== undefined){
            let isOnly  = true;
            for(let i = 0 ; i < combinaisons.length ; i++){
                const combi : CombiCalculated | undefined = combinaisons[i].getCombinaison(joueurVent, dominant);
                if(combi === undefined){
                    isOnly = false;
                }else{
                    // don't take in consideration the honnor
                    if(!isHonneurFamille(combi.famille)){
                        if(!combi.modificateur.has(ModificateurCombi.ExtremNumero)){
                            isOnly = false;
                        }
                    }
                }
            }
            if(isOnly){
                return MahjongScoring.OnlyExtremNumero;
            }
        }
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
    const mahjongScoring : MahjongScoring[] = [MahjongScoring.normal];
    // if there is no combinaison, return an empty array
    if(combinaisons.length === 0){
        return mahjongScoring;
    }else{
        // test all the possible mahjong scoring
        const mahjongScoringTrouble : MahjongScoring | undefined = isMahjongTrouble(combinaisons, joueurVent, dominant);
        if(mahjongScoringTrouble !== undefined){
            mahjongScoring.push(mahjongScoringTrouble);
        }
        const mahjongScoringPairBrelanSuite : MahjongScoring | undefined = isMahjongPairBrelanSuite(combinaisons, joueurVent, dominant);
        if(mahjongScoringPairBrelanSuite !== undefined){
            mahjongScoring.push(mahjongScoringPairBrelanSuite);
        }
        const mahjongScoringOnly1or9 : MahjongScoring | undefined = isMahjongOnly1or9(combinaisons, joueurVent, dominant);
        if(mahjongScoringOnly1or9 !== undefined){
            mahjongScoring.push(mahjongScoringOnly1or9);
        }

        return mahjongScoring;
    }
    
}