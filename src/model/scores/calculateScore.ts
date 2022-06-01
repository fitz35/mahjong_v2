import { Combinaison } from "../dataModel/Combinaison";
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
function getCombiScoringRulesFromCombinaison(
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
    combinaisons: Combinaison[],
    joueurVent: NumeroVent,
    dominant: NumeroVent
): CombiScore {
    // get the association between the combinaison and the combi scoring rule
    const combiScoringRules: Map<Combinaison, CombiScoringRule> = new Map();
    for (let i = 0; i < combinaisons.length; i++) {
        const combi: CombiCalculated | undefined = combinaisons[
            i
        ].getCombinaison(joueurVent, dominant);
        if (combi !== undefined) {
            const combiScoringRule: CombiScoringRule | undefined =
                getCombiScoringRulesFromCombinaison(combi);
            if (combiScoringRule !== undefined) {
                combiScoringRules.set(combinaisons[i], combiScoringRule);
            }
        }
    }

    // calculate the score (aggregation of each combinaison)
    let addition = 0;
    let multiplicateur = 0;
    for (let i = 0; i < combinaisons.length; i++) {
        const combiScoringRule: CombiScoringRule | undefined =
            combiScoringRules.get(combinaisons[i]);
        if (combiScoringRule !== undefined) {
            // difference beetween open and closed combinaison
            if (combinaisons[i].visible) {
                addition += combiScoringRule.open;
            } else {
                addition += combiScoringRule.hidden;
            }

            multiplicateur += combiScoringRule.multiplicator;
        }
    }

    return {
        addition,
        multiplicateur,
    };
}

/**
 * calculate the score of the player
 * @param combinaisons the combinaisons of the player
 * @param joueurVent the vent of the player
 * @param dominant the dominant vent
 */
export function calculateScoring(
    combinaisons: Combinaison[],
    joueurVent: NumeroVent,
    dominant: NumeroVent
): number {
    // get the mahjong scoring of the combinaisons
    const mahjongScoring: MahjongScoring[] = getMahjongScoring(
        combinaisons,
        joueurVent,
        dominant
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

    return 0;
}
