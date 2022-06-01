import { CombiScoringRule, MahjongScoringRule } from "./interfacesScoringRules";
import combiData from "../../data/combiScoring.json";
import mahjongData from "../../data/mahjongScoring.json";

/**
 * get the combi scoring in the json file
 * @return the combi scoring
 */
export function getCombiScoringRules() : CombiScoringRule[] {
    return combiData.map(
        (value: 
            { id: number; 
                name: string; 
                open: number; 
                hidden: number; 
                multiplicator: number; 
                baseCombi: string; 
                modificateur: string[]; 
            }) => {return value as CombiScoringRule;}
    );
}

/**
 * get the mahjong scoring in the json file
 * @return the mahjong scoring
 */
export function getMahjongScoringRules() : MahjongScoringRule[] {
    return mahjongData.map(
        (value:
            { id: number;
                name: string;
                open: number;
                hidden: number;
                multiplicator: number;
            }) => {return value as MahjongScoringRule;});
}


/**
 * get the mahjong scoring rule with an id
 * @param id the id of the mahjong scoring rule
 * @returns the mahjong scoring rule
 */
export function getMahjongScoringRulesFromId(
    id: number
): MahjongScoringRule | undefined {
    // get all combinaison rules
    const mahjongScoringRules: MahjongScoringRule[] = getMahjongScoringRules();
    for (let i = 0; i < mahjongScoringRules.length; i++) {
        const mahjongScoringRule: MahjongScoringRule = mahjongScoringRules[i];
        if (mahjongScoringRule.id === id) {
            return mahjongScoringRule;
        }
    }

    return undefined;
}

/**
 *  get scoring rule by id
 * @param id the id of the combi scoring rule
 * @returns the combi scoring rule
 */ 
export function getScoringRuleFromId(id : number) : CombiScoringRule | undefined {
    const combiScoringRules : CombiScoringRule[] = getCombiScoringRules();
    for (let i = 0; i < combiScoringRules.length; i++) {
        const combiScoringRule : CombiScoringRule = combiScoringRules[i];
        if (combiScoringRule.id === id) {
            return combiScoringRule;
        }
    }

    return undefined;
}

///////////////////////////////////////////////////////////////////
// for testing purpose
///////////////////////////////////////////////////////////////////

/**
 * 
 * @param name the name of the combi scoring rule
 * @returns the combi scoring rule
 */
export function getCombiRulesByName(name : string) : CombiScoringRule | undefined {
    const combiScoringRules : CombiScoringRule[] = getCombiScoringRules();
    for (let i = 0; i < combiScoringRules.length; i++) {
        const combiScoringRule : CombiScoringRule = combiScoringRules[i];
        if (combiScoringRule.name === name) {
            return combiScoringRule;
        }
    }

    return undefined;
}