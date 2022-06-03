import { Combinaison } from "../dataModel/Combinaison";
import { NumeroVent } from "../dataModel/dataUtils";

export type SearchParamsMain = Combinaison[];
export type SearchParamsJoueur = {
    main : SearchParamsMain
    vent : NumeroVent
    points : number[] // cumulated
}

/**
 * all necessary to restore game state
 */
export type GameSearchParamsCalculator = {
    
    joueur1 : SearchParamsJoueur
    joueur2 : SearchParamsJoueur
    joueur3 : SearchParamsJoueur
    joueur4 : SearchParamsJoueur
    dominantVent : NumeroVent
    default : boolean
}

export const defaultGameSearchParamsCalculator : GameSearchParamsCalculator = {
    joueur1 : {
        main : [],
        vent : NumeroVent.Est,
        points : []
    },
    joueur2 : {
        main : [],
        vent : NumeroVent.Sud,
        points : []
    },
    joueur3 : {
        main : [],
        vent : NumeroVent.Ouest,
        points : []
    },
    joueur4 : {
        main : [],
        vent : NumeroVent.Nord,
        points : []
    },
    dominantVent : NumeroVent.Est,
    default : true
};

////////////////////////////////////////////////////////////
// param of the url

/**
 * get the vent player key from the url
 * @param playerIndice the indice of the player
 * @returns the vent player key
 */
export function getVentKey(playerIndice: number): string {
    return `vent${playerIndice + 1}`;
}

/**
 *
 * @param playerIndice the indice of the player
 * @returns the points player key
 */
export function getPointsKey(playerIndice: number): string {
    return `points${playerIndice + 1}`;
}

/**
 *
 * @returns the dominent vent key in the url
 */
export function getDominantVentKey(): string {
    return "dominantVent";
}

/**
 *
 * @param playerIndice the indice of the player
 * @returns the main player key
 */
export function getMainKey(playerIndice: number): string {
    return `main${playerIndice + 1}`;
}

/**
 * 
 * @returns the representative string of the error key search params
 */
export function getErrorKey() : string {
    return "error";
}

/**
 * 
 * @returns the representative string of the default key search params
 */
export function getDefaultKey() : string {
    return "default";
}

/**
 *
 * @returns the first depth separator in array in the url
 */
export function getFirstDepthArraySeparator(): string {
    return ",";
}

/**
 *
 * @returns the second depth separator in array in the url
 */
export function getSecondDepthArraySeparator(): string {
    return ".";
}

/**
 * @param joueurIndice the indice of the player
 * @param searchParamsMain the main search params
 * @returns the representative string of the main search params
 */
function tranformSearchParamsMainToString(joueurIndice : number, searchParamsMain: SearchParamsMain): string {
    return getMainKey(joueurIndice) + "=" + searchParamsMain.map(
        (combinaison) => combinaison.pieces.map(
            (piece) => piece.getCode()
        ).join(getSecondDepthArraySeparator())
    ).join(getFirstDepthArraySeparator());
}

/**
 * 
 * @param joueurIndice the indice of the player
 * @param points the points of the player
 * @returns the representative string of the points search params
 */
function transformPointsToString(joueurIndice : number, points: number[]): string {
    return getPointsKey(joueurIndice) + "=" + points.join(getFirstDepthArraySeparator());
}

/**
 * 
 * @param joueurIndice the indice of the player
 * @param searchParamsJoueur the search params of the player
 * @returns the representative string of the search params of the player
 */
function tranformSearchParamsJoueurToString(joueurIndice : number, searchParamsJoueur: SearchParamsJoueur): string {
    return getVentKey(joueurIndice) + "=" + searchParamsJoueur.vent + "&" + 
    transformPointsToString(joueurIndice, searchParamsJoueur.points) + "&" +
    tranformSearchParamsMainToString(joueurIndice, searchParamsJoueur.main);
}

/**
 * 
 * @param searchParamsCalculator the search params calculator
 * @returns the representative string of the search params calculator
 */
export function transformSearchParamsCalculatorToString(searchParamsCalculator: GameSearchParamsCalculator): string {
    return tranformSearchParamsJoueurToString(0, searchParamsCalculator.joueur1) + "&" +
    tranformSearchParamsJoueurToString(1, searchParamsCalculator.joueur2) + "&" +
    tranformSearchParamsJoueurToString(2, searchParamsCalculator.joueur3) + "&" +
    tranformSearchParamsJoueurToString(3, searchParamsCalculator.joueur4) + "&" +
    getDominantVentKey() + "=" + searchParamsCalculator.dominantVent;
}