import { Combinaison } from "../dataModel/Combinaison";
import {Expose, instanceToPlain, plainToInstance, Transform, Type } from "class-transformer";

import { NumeroVent } from "../dataModel/dataUtils";

export class SearchParamsJoueur {
    @Expose()
    @Type(() => Combinaison)
        main: Combinaison[];

    @Expose()
    @Transform(({ value }) => {return value as NumeroVent;}, { toClassOnly: true })
        vent: NumeroVent;

    @Expose()
        name: string;
        
    @Expose()
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
    @Expose()
    @Type(() => SearchParamsJoueur)
    readonly joueur1: SearchParamsJoueur;
    @Expose()
    @Type(() => SearchParamsJoueur)
    readonly joueur2: SearchParamsJoueur;
    @Expose()
    @Type(() => SearchParamsJoueur)
    readonly joueur3: SearchParamsJoueur;
    @Expose()
    @Type(() => SearchParamsJoueur)
    readonly joueur4: SearchParamsJoueur;
    @Expose()
    @Transform(({ value }) => {
        return value as NumeroVent;
    })
    readonly dominantVent: NumeroVent;
    @Expose()
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

    /**
     * set the player 1
     * @param joueur1 
     * @returns the new game state
     */
    setJoueur1(joueur1: SearchParamsJoueur) : GameSearchParamsCalculator {
        return new GameSearchParamsCalculator(
            joueur1, 
            this.joueur2, 
            this.joueur3, 
            this.joueur4, 
            this.dominantVent, 
            false
        );
    }

    /**
     * set the player 2
     * @param joueur2 
     * @returns the new game state
     */
    setJoueur2(joueur2: SearchParamsJoueur) : GameSearchParamsCalculator {
        return new GameSearchParamsCalculator(
            this.joueur1, 
            joueur2, 
            this.joueur3, 
            this.joueur4, 
            this.dominantVent, 
            false
        );
    }

    /**
     * set the player 3
     * @param joueur3
     * @returns the new game state
     */
    setJoueur3(joueur3: SearchParamsJoueur) : GameSearchParamsCalculator {
        return new GameSearchParamsCalculator(
            this.joueur1, 
            this.joueur2, 
            joueur3, 
            this.joueur4, 
            this.dominantVent, 
            false
        );
    }

    /**
     * set the player 4
     * @param joueur4
     * @returns the new game state
     */
    setJoueur4(joueur4: SearchParamsJoueur) : GameSearchParamsCalculator {
        return new GameSearchParamsCalculator(
            this.joueur1, 
            this.joueur2, 
            this.joueur3, 
            joueur4, 
            this.dominantVent, 
            false
        );
    }

    // set the player with indices 0, 1, 2, 3
    setJoueur(index: number, joueur: SearchParamsJoueur) : GameSearchParamsCalculator {
        switch (index) {    
            case 0:
                return this.setJoueur1(joueur);
            case 1:
                return this.setJoueur2(joueur);
            case 2:
                return this.setJoueur3(joueur);
            case 3:
                return this.setJoueur4(joueur);
            default:
                throw new Error("index must be between 0 and 3");
        }
    }

    // set all the joueurs
    setJoueurs(
        joueur1 : SearchParamsJoueur, 
        joueur2 : SearchParamsJoueur, 
        joueur3 : SearchParamsJoueur, 
        joueur4 : SearchParamsJoueur
    ) : GameSearchParamsCalculator {
        return new GameSearchParamsCalculator(
            joueur1, 
            joueur2, 
            joueur3, 
            joueur4, 
            this.dominantVent, 
            false
        );
    }

    /**
     * set the dominant vent
     * @param dominantVent 
     * @returns the new game state
     */
    setDominantVent(dominantVent: NumeroVent) : GameSearchParamsCalculator {
        return new GameSearchParamsCalculator(
            this.joueur1, 
            this.joueur2, 
            this.joueur3, 
            this.joueur4, 
            dominantVent, 
            false
        );
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
