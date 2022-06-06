import { Combinaison } from "../dataModel/Combinaison";
import {instanceToPlain, plainToInstance, Transform, Type } from "class-transformer";

import { NumeroVent } from "../dataModel/dataUtils";

export class SearchParamsJoueur {
    @Type(() => Combinaison)
        main: Combinaison[];
    @Transform(({ value }) => {return value as NumeroVent;}, { toClassOnly: true })
        vent: NumeroVent;
    name: string;
    points: number[]; // cumulated

    constructor(
        main: Combinaison[],
        vent: NumeroVent,
        name: string,
        points: number[]
    ) {
        this.main = main;
        this.vent = vent;
        this.name = name;
        this.points = points;
    }
}

/**
 * all necessary to restore game state
 */
export class GameSearchParamsCalculator {
    @Type(() => SearchParamsJoueur)
        joueur1: SearchParamsJoueur;
    @Type(() => SearchParamsJoueur)
        joueur2: SearchParamsJoueur;
    @Type(() => SearchParamsJoueur)
        joueur3: SearchParamsJoueur;
    @Type(() => SearchParamsJoueur)
        joueur4: SearchParamsJoueur;
    @Transform(({ value }) => {
        return value as string;
    })
        dominantVent: NumeroVent;
    isDefault: boolean;

    constructor(
        joueur1: SearchParamsJoueur,
        joueur2: SearchParamsJoueur,
        joueur3: SearchParamsJoueur,
        joueur4: SearchParamsJoueur,
        dominantVent: NumeroVent,
        isDefault: boolean
    ) {
        this.joueur1 = joueur1;
        this.joueur2 = joueur2;
        this.joueur3 = joueur3;
        this.joueur4 = joueur4;
        this.dominantVent = dominantVent;
        this.isDefault = isDefault;
    }
}

export const defaultGameSearchParamsCalculator: GameSearchParamsCalculator =
    plainToInstance(GameSearchParamsCalculator, {
        joueur1: {
            main: [],
            vent: NumeroVent.Est,
            points: [],
            name: "Joueur 1",
        },
        joueur2: {
            main: [],
            vent: NumeroVent.Sud,
            points: [],
            name: "Joueur 2",
        },
        joueur3: {
            main: [],
            vent: NumeroVent.Ouest,
            points: [],
            name: "Joueur 3",
        },
        joueur4: {
            main: [],
            vent: NumeroVent.Nord,
            points: [],
            name: "Joueur 4",
        },
        dominantVent: NumeroVent.Est,
        isDefault: true,
    });

////////////////////////////////////////////////////////////
// param of the url

export function getGameSearchParamsCalculatorKey(): string {
    return "calculatorState";
}

/**
 *
 * @param searchParamsCalculator the search params calculator
 * @returns the representative string of the search params calculator
 */
export function transformSearchParamsCalculatorToString(
    searchParamsCalculator: GameSearchParamsCalculator
): string {
    return (
        getGameSearchParamsCalculatorKey() +
        "=" +
        JSON.stringify(instanceToPlain(searchParamsCalculator))
    );
}
