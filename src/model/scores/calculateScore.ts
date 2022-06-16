import { Combinaison, CombinaisonExposeType } from "../dataModel/Combinaison";
import {
    CombiCalculated,
    MahjongScoring,
    NumeroVent,
} from "../dataModel/dataUtils";
import {
    CombiScoringRule,
    MahjongScoringRule,
} from "../rules/interfacesScoringRules";
import {
    getCombiScoringRules,
    getMahjongScoringRulesFromId,
} from "../rules/readScoringRules";
import { compareSet } from "../utils/setUtils";
import { getMahjongScoring } from "./mahjongDetect";

/**
 * the combi score is the sum of the score of each combinaison
 */
export type CombiScore = {
    addition: number;
    multiplicateur: number;
};

/**
 * get the combinaison ruling for the calculated combinaison
 * @param combinaison the combinaison to test
 * @returns the combinaison ruling
 */
export function getCombiScoringRulesFromCombinaison(
    combinaison: CombiCalculated
): CombiScoringRule | undefined {
    // get all combinaison rules
    const combiScoringRules: CombiScoringRule[] = getCombiScoringRules();
    for (let i = 0; i < combiScoringRules.length; i++) {
        const combiScoringRule: CombiScoringRule = combiScoringRules[i];
        if (
            combiScoringRule.baseCombi === combinaison.base &&
            compareSet(
                new Set(combiScoringRule.modificateur),
                combinaison.modificateur
            )
        ) {
            return combiScoringRule;
        }
    }

    return undefined;
}

/**
 * calculate the score of combinaison
 * @param combinaisons the array of combinaison
 * @param joueurVent the vent of the player
 * @param dominant the dominant vent
 * @returns the base score for this combinaison
 */
export function calculateCombiScore(
    combinaisons: Combinaison[]
): CombiScore {
    // get the association between the combinaison and the combi scoring rule
    const combiScoringRules: Map<Combinaison, CombiScoringRule[]> = new Map();
    for (let i = 0; i < combinaisons.length; i++) {
        const combi: CombiCalculated[] = combinaisons[i].combiCalculated;
        const combiScoringRulesActu: CombiScoringRule[] = [];
        // for every combi calculated, we get the combi scoring rule
        for (let j = 0; j < combi.length; j++) {
            const combiScoringRuleActu: CombiScoringRule | undefined =
                getCombiScoringRulesFromCombinaison(combi[j]);
            if (combiScoringRuleActu !== undefined) {
                combiScoringRulesActu.push(combiScoringRuleActu);
            }
        }
        combiScoringRules.set(combinaisons[i], combiScoringRulesActu);
    }

    // calculate the score (aggregation of each combinaison)
    let addition = 0;
    let multiplicateur = 0;
    for (let i = 0; i < combinaisons.length; i++) {
        const combiScoringRule: CombiScoringRule[] | undefined =
            combiScoringRules.get(combinaisons[i]);
        if (combiScoringRule !== undefined) {
            // for every combi scoring rule, we add the score
            for (let j = 0; j < combiScoringRule.length; j++) {
                // difference beetween open and closed combinaison
                if (
                    combinaisons[i].exposeType === CombinaisonExposeType.VISIBLE || 
                    combinaisons[i].exposeType === CombinaisonExposeType.HONNOR
                ) {
                    addition += combiScoringRule[j].open;
                } else {
                    addition += combiScoringRule[j].hidden;
                }

                multiplicateur += combiScoringRule[j].multiplicator;
            }
        }
    }

    return {
        addition,
        multiplicateur,
    };
}

/**
 * get the mahjong scoring rules
 * @param combinaisons the array of combinaison
 * @param joueurVent the vent of the player
 * @param dominant the dominant vent
 * @returns the mahjong scoring rules
 */
function calculateMahjongScoringRules(
    combinaisons: Combinaison[]
): MahjongScoringRule[] {
    // get the mahjong scoring of the combinaisons
    const mahjongScoring: MahjongScoring[] = getMahjongScoring(
        combinaisons
    );
    // get the mahjong scoring rule of the combinaisons
    const combiMahjongScoringRules: MahjongScoringRule[] = [];
    for (let i = 0; i < mahjongScoring.length; i++) {
        const combiMahjongScoringRule: MahjongScoringRule | undefined =
            getMahjongScoringRulesFromId(mahjongScoring[i]);
        if (combiMahjongScoringRule !== undefined) {
            combiMahjongScoringRules.push(combiMahjongScoringRule);
        }
    }
    return combiMahjongScoringRules;
}

/**
 * calculate the score
 * @param combiScore the score of combinaison
 * @param mahjongScoring the mahjong scoring rules 
 * @returns the global score
 */
function calculate(combiScore: CombiScore[], mahjongScoring : MahjongScoringRule[]): number {
    let add = 0;
    let mult = 0;
    for (let i = 0; i < combiScore.length; i++) {
        add += combiScore[i].addition;
        mult += combiScore[i].multiplicateur;
    }
    for(let i = 0; i < mahjongScoring.length; i++) {
        add += mahjongScoring[i].open;
        mult += mahjongScoring[i].multiplicator;
    }

    if(mult === 0) {
        mult = 1;
    }
    
    return add * mult;
}


function calculateBestMahjongScoring(
    combiScore: CombiScore,
    mahjongScoringRules: MahjongScoringRule[]
): MahjongScoringRule | undefined {
    if (mahjongScoringRules.length === 0) {
        return undefined;
    } else {
        let bestMahjongScoring: MahjongScoringRule = mahjongScoringRules[0];
        for (let i = 1; i < mahjongScoringRules.length; i++) {
            const bestScore = calculate([combiScore], [bestMahjongScoring]);
            const currentScore = calculate([combiScore], [mahjongScoringRules[i]]);

            if (bestScore < currentScore) {
                bestMahjongScoring = mahjongScoringRules[i];
            }
        }
        return bestMahjongScoring;
    }
}

/**
 * calculate the score of the player
 * @param combinaisons the combinaisons of the player
 * @param joueurVent the vent of the player
 * @param dominant the dominant vent
 * @param mahjong if this player has mahjong
 * @returns the score of the player
 */
export function calculateFlatScoring(
    combinaisons: Combinaison[],
    joueurVent: NumeroVent,
    dominant: NumeroVent,
    mahjong = false
): number {
    // get the combi score
    const combiScore: CombiScore = calculateCombiScore(
        combinaisons
    );
    // if this is the player who has mahjong, we add the mahjong score
    if(mahjong) {
        // get the mahjong scoring rules
        const mahjongScoringRules: MahjongScoringRule[] = calculateMahjongScoringRules(
            combinaisons
        );
        // get the best mahjong scoring rule
        const bestMahjongScoringRule: MahjongScoringRule | undefined =
            calculateBestMahjongScoring(combiScore, mahjongScoringRules);

        // calculate the score
        if(bestMahjongScoringRule !== undefined) {
            const bestScore = calculate([combiScore], [bestMahjongScoringRule]);
            if(bestScore > 3000) return 3000;
            else return bestScore;
            
        } else {
            return 0;
        }
    } else { // if this is not the player who has mahjong, we add only the combi score
        const score = calculate([combiScore], []);
        if(score > 3000) return 3000;
        else return score;
    }
}
