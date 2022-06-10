import { NumeroVent } from "../../model/dataModel/dataUtils";
import {
    MancheCalculatorState,
    getGameSearchParamsCalculatorKey,
    JoueurCalculatorState
} from "../../model/gameStateCalculator/MancheCalculatorState";
import { getJoueurGenerator } from "../../model/utils/joueursUtils";
import { MyLogger } from "../../model/utils/logger";

////////////////////////////////////////////////////////////////////
// check param fonction
///////////////////////////////////////////////////////////////////

/**
 *
 * @param ventOfPlayer the vent of the player
 * @returns if the vent is valid
 */
export function checkVentCoherence(
    gameParamsCalculator : MancheCalculatorState
): boolean {
    let invalidVent = false;
    const ventArray: NumeroVent[] = [
        NumeroVent.Est,
        NumeroVent.Sud,
        NumeroVent.Ouest,
        NumeroVent.Nord,
    ];
    const players = getJoueurGenerator<JoueurCalculatorState, MancheCalculatorState>(gameParamsCalculator);
    for (const [player,] of players) {
        if (player !== undefined) {
            const toRemove: NumeroVent[] = ventArray.splice(
                ventArray.indexOf(player.vent),
                1
            );
            if (toRemove.length === 0) {
                // if the vent is already used, we set the invalid vent flag to true and we stop the loop
                invalidVent = true;
                break;
            }   
        }else{
            invalidVent = true;
            break;
        }    
    }
    return !invalidVent;
}

/**
 *
 * @param pointOfPlayer the point of the player
 * @returns the point of the player if the point is valid else undefined
 */
function checkPointsCoherence(
    gameParamsCalculator : MancheCalculatorState
): boolean {
    let invalidPoint = false;
    let pointsRef : number | undefined = undefined;
    const players = getJoueurGenerator<JoueurCalculatorState, MancheCalculatorState>(gameParamsCalculator);
    for (const [player, ] of players) {
        if (player !== undefined) {
            if (pointsRef === undefined) {
                pointsRef = player.points.length;
            } else {
                if (player.points.length !== pointsRef) {
                    // if the array of points is not the same size, we set the invalid point flag to true and we stop the loop
                    invalidPoint = true;
                    break;
                }
            }
        }else{
            invalidPoint = true;
            break;
        }
    }
    return !invalidPoint;
}

///////////////////////////////////////////////////////////////////
// hook
///////////////////////////////////////////////////////////////////

export function convertUrlSearchParamsInGameParamsCalculator(
    searchParams: URLSearchParams
): MancheCalculatorState | undefined {
    const jsonString = searchParams.get(getGameSearchParamsCalculatorKey());
    // get the json string
    if (jsonString !== null) {
        // try to parse the json string
        try {
            const gameParamsCalculator: MancheCalculatorState = JSON.parse(jsonString);
            MyLogger.debug(`convertUrlSearchParamsInGameParamsCalculator: ${JSON.stringify(gameParamsCalculator)}`);
            // if the param is invalid, we set the default value and recharge the url
            if (
                !checkVentCoherence(gameParamsCalculator) ||
                !checkPointsCoherence(gameParamsCalculator)
            ) {
                return undefined;
            } else {
                return gameParamsCalculator;
            }
        } catch (e) {
            MyLogger.debug("test", e);
            return undefined;
        }
    } else {
        return undefined;
    }
}
