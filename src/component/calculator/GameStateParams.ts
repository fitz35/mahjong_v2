import { Combinaison } from "../../model/dataModel/Combinaison";
import { checkNumeroVent, NumeroVent } from "../../model/dataModel/dataUtils";
import { Piece } from "../../model/dataModel/Piece";
import {
    getDominantVentKey,
    getFirstDepthArraySeparator,
    getMainKey,
    getPointsKey,
    getSecondDepthArraySeparator,
    getVentKey,
    GameSearchParamsCalculator,
    SearchParamsMain,
} from "../../model/gameState/GameSearchParamsCalculator";

////////////////////////////////////////////////////////////////////
// check param fonction
///////////////////////////////////////////////////////////////////

/**
 *
 * @param pointsParamStr the points param string
 * @returns the points if no error else undefined
 */
function checkPoints(pointsParamStr: string): number[] | undefined {
    const pointsStrSplit = pointsParamStr.split(getFirstDepthArraySeparator());
    const points: number[] = [];
    let invalidPoint = false;
    for (const pointStr of pointsStrSplit) {
        const point = parseInt(pointStr);
        if (!isNaN(point)) {
            points.push(point);
        } else {
            // if we have an invalid point, we set the invalid point flag to true and we stop the loop
            invalidPoint = true;
            break;
        }
    }
    if (!invalidPoint) {
        return points;
    } else {
        return undefined;
    }
}

/**
 *
 * @param mainParamStr the main param string
 * @returns the search params if no error else undefined
 */
function checkMain(mainParamStr: string): SearchParamsMain | undefined {
    const mainStrSplit = mainParamStr.split(getFirstDepthArraySeparator());
    const main: SearchParamsMain = [];
    let invalidMain = false;
    for (const mainStr of mainStrSplit) {
        // for each combinaison
        const mainPart = mainStr.split(getSecondDepthArraySeparator());
        const mainPartChecked: Piece[] = [];
        for (const mainPartStr of mainPart) {
            // for each piece
            let piece: Piece;
            try {
                // try to create the piece
                piece = new Piece(mainPartStr);
                mainPartChecked.push(piece);
            } catch (e) {
                invalidMain = true;
                break;
            }
        }
        if (!invalidMain) {
            main.push(new Combinaison(mainPartChecked));
        } else {
            return undefined;
        }
    }
    return main;
}

/**
 *
 * @param ventOfPlayer the vent of the player
 * @returns if the vent is valid
 */
function checkVentCoherence(
    ventOfPlayer: Map<number, NumeroVent | undefined>
): NumeroVent[] | undefined {
    let invalidVent = false;
    const vents: NumeroVent[] = [];
    const ventArray: NumeroVent[] = [
        NumeroVent.Est,
        NumeroVent.Sud,
        NumeroVent.Ouest,
        NumeroVent.Nord,
    ];
    for (const [, vent] of ventOfPlayer) {
        if (vent === undefined) {
            // if one unexistent vent, we set the invalid vent flag to true and we stop the loop
            invalidVent = true;
            break;
        } else {
            const toRemove: NumeroVent[] = ventArray.splice(
                ventArray.indexOf(vent),
                1
            );
            if (toRemove.length === 0) {
                // if the vent is already used, we set the invalid vent flag to true and we stop the loop
                invalidVent = true;
                break;
            } else {
                vents.push(vent);
            }
        }
    }
    if (!invalidVent) {
        return vents;
    } else {
        return undefined;
    }
}

/**
 *
 * @param pointOfPlayer the point of the player
 * @returns the point of the player if the point is valid else undefined
 */
function checkPointsCoherence(
    pointOfPlayer: Map<number, number[] | undefined>
): number[][] | undefined {
    let invalidPoint = false;
    const points: number[][] = [];
    let pointsRef = 0;
    for (const [i, point] of pointOfPlayer) {
        if (point === undefined) {
            // if one unexistent point, we set the invalid point flag to true and we stop the loop
            invalidPoint = true;
            break;
        } else {
            if (i === 0) {
                pointsRef = point.length;
            } else {
                if (point.length !== pointsRef) {
                    // if the array of points is not the same size, we set the invalid point flag to true and we stop the loop
                    invalidPoint = true;
                    break;
                }
            }
            points.push(point);
        }
    }
    if (!invalidPoint) {
        return points;
    } else {
        return undefined;
    }
}

/**
 *
 * @param mainOfPlayer the main of the player
 * @returns the main of the player if the main is valid else undefined
 */
function checkMainCoherence(
    mainOfPlayer: Map<number, SearchParamsMain | undefined>
): SearchParamsMain[] | undefined {
    let invalidMain = false;
    const mains: SearchParamsMain[] = [];
    for (const [, main] of mainOfPlayer) {
        if (main === undefined) {
            // if one unexistent main, we set the invalid main flag to true and we stop the loop
            invalidMain = true;
            break;
        } else {
            mains.push(main);
        }
    }
    if (!invalidMain) {
        return mains;
    } else {
        return undefined;
    }
}

///////////////////////////////////////////////////////////////////
// hook
///////////////////////////////////////////////////////////////////

export function convertUrlSearchParamsInGameParamsCalculator(
    searchParams: URLSearchParams
): GameSearchParamsCalculator | undefined {
    const numberOfPlayer = 4;
    // check the dominant vent
    let dominantVent: NumeroVent | undefined;
    if (searchParams.has(getDominantVentKey())) {
        const dominantVentStr = searchParams.get(
            getDominantVentKey()
        ) as string;
        if (checkNumeroVent(dominantVentStr)) {
            dominantVent = dominantVentStr as NumeroVent;
        } else {
            dominantVent = undefined;
        }
    } else {
        dominantVent = undefined;
    }

    const ventOfPlayer: Map<number, NumeroVent | undefined> = new Map();
    const pointOfPlayer: Map<number, number[] | undefined> = new Map();
    const mainOfPlayer: Map<number, SearchParamsMain | undefined> = new Map();
    for (let i = 0; i < numberOfPlayer; i++) {
        // verify and get the vent
        if (searchParams.has(getVentKey(i))) {
            const vent = searchParams.get(getVentKey(i)) as string;
            if (checkNumeroVent(vent)) {
                ventOfPlayer.set(i, vent as NumeroVent);
            } else {
                ventOfPlayer.set(i, undefined);
            }
        } else {
            ventOfPlayer.set(i, undefined);
        }

        // verify the point :
        if (searchParams.has(getPointsKey(i))) {
            pointOfPlayer.set(
                i,
                checkPoints(searchParams.get(getPointsKey(i)) as string)
            );
        } else {
            pointOfPlayer.set(i, undefined);
        }

        // verify the main
        if (searchParams.has(getMainKey(i))) {
            mainOfPlayer.set(
                i,
                checkMain(searchParams.get(getMainKey(i)) as string)
            );
        } else {
            mainOfPlayer.set(i, undefined);
        }
    }

    // check all the map
    const ventOfPlayerChecked: NumeroVent[] | undefined =
        checkVentCoherence(ventOfPlayer);
    const pointOfPlayerChecked: number[][] | undefined =
        checkPointsCoherence(pointOfPlayer);
    const mainOfPlayerChecked: SearchParamsMain[] | undefined =
        checkMainCoherence(mainOfPlayer);

    // if the param is invalid, we set the default value and recharge the url
    if (
        dominantVent === undefined ||
        ventOfPlayerChecked === undefined ||
        pointOfPlayerChecked === undefined ||
        mainOfPlayerChecked === undefined
    ) {
        return undefined;
    } else {
        return {
            dominantVent: dominantVent,
            joueur1: {
                vent: ventOfPlayerChecked[0],
                points: pointOfPlayerChecked[0],
                main: mainOfPlayerChecked[0],
            },
            joueur2: {
                vent: ventOfPlayerChecked[1],
                points: pointOfPlayerChecked[1],
                main: mainOfPlayerChecked[1],
            },
            joueur3: {
                vent: ventOfPlayerChecked[2],
                points: pointOfPlayerChecked[2],
                main: mainOfPlayerChecked[2],
            },
            joueur4: {
                vent: ventOfPlayerChecked[3],
                points: pointOfPlayerChecked[3],
                main: mainOfPlayerChecked[3],
            },
            default: false,
        };
    }
}
