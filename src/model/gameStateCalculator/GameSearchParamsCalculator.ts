import { Combinaison } from "../dataModel/Combinaison";
import {Expose, instanceToPlain, plainToInstance, Transform, Type } from "class-transformer";

import { NumeroVent } from "../dataModel/dataUtils";
import { CombiSelected } from "./useCalculatorHistoricState";
import { Piece } from "../dataModel/Piece";

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

    /**
     * add a combinaison to a player
     * @param index the player index
     * @param combinaison the combinaison to add
     * @returns the new game state
     */
    addCombinaison(index: number, combinaison: Combinaison) : GameSearchParamsCalculator {
        switch (index) {    
            case 0:
                return this.setJoueur1(
                    new SearchParamsJoueur(
                        [...this.joueur1.main, combinaison], 
                        this.joueur1.vent, 
                        this.joueur1.name, 
                        this.joueur1.points
                    )
                );
            case 1:
                return this.setJoueur2(
                    new SearchParamsJoueur(
                        [...this.joueur2.main, combinaison], 
                        this.joueur2.vent, 
                        this.joueur2.name, 
                        this.joueur2.points
                    )
                );
            case 2:
                return this.setJoueur3(
                    new SearchParamsJoueur(
                        [...this.joueur3.main, combinaison], 
                        this.joueur3.vent, 
                        this.joueur3.name, 
                        this.joueur3.points
                    )
                );
            case 3:
                return this.setJoueur4(
                    new SearchParamsJoueur(
                        [...this.joueur4.main, combinaison], 
                        this.joueur4.vent, 
                        this.joueur4.name, 
                        this.joueur4.points
                    )
                );
            default:
                throw new Error("index must be between 0 and 3");
        }    
    }

    /**
     * remove a combinaison from a player
     * @param index the player index
     * @param combinaisonIndex the index of the combinaison to remove
     * @returns the new game state
     */
    removeCombinaison(index: number, combinaisonIndex: number) : GameSearchParamsCalculator {
        switch (index) {    
            case 0:
                return this.setJoueur1(
                    new SearchParamsJoueur(
                        this.joueur1.main.filter((_, i) => i !== combinaisonIndex), 
                        this.joueur1.vent, 
                        this.joueur1.name, 
                        this.joueur1.points
                    )
                );
            case 1:
                return this.setJoueur2(
                    new SearchParamsJoueur(
                        this.joueur2.main.filter((_, i) => i !== combinaisonIndex),
                        this.joueur2.vent,
                        this.joueur2.name,
                        this.joueur2.points
                    )
                );
            case 2:
                return this.setJoueur3(
                    new SearchParamsJoueur(
                        this.joueur3.main.filter((_, i) => i !== combinaisonIndex),
                        this.joueur3.vent,
                        this.joueur3.name,
                        this.joueur3.points
                    )
                );
            case 3:
                return this.setJoueur4(
                    new SearchParamsJoueur(
                        this.joueur4.main.filter((_, i) => i !== combinaisonIndex),
                        this.joueur4.vent,
                        this.joueur4.name,
                        this.joueur4.points
                    )
                );
            default:
                throw new Error("index must be between 0 and 3");
        }
    }

    /**
     * add a piece to a combinaison
     * @param combiSelected the combinaison index and the player index
     * @param piece the piece to add
     * @returns the new game state
     */
    addPiece(combiSelected: CombiSelected, piece: Piece) : GameSearchParamsCalculator {
        switch(combiSelected.playerIndex){
            case 0:
                return this.setJoueur1(
                    new SearchParamsJoueur(
                        this.joueur1.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    [...combinaison.pieces, piece],
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur1.vent,
                        this.joueur1.name,
                        this.joueur1.points
                    )
                );
            case 1:
                return this.setJoueur2(
                    new SearchParamsJoueur(
                        this.joueur2.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    [...combinaison.pieces, piece],
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur2.vent,
                        this.joueur2.name,
                        this.joueur2.points
                    )
                );
            case 2:
                return this.setJoueur3(
                    new SearchParamsJoueur(
                        this.joueur3.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    [...combinaison.pieces, piece],
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur3.vent,
                        this.joueur3.name,
                        this.joueur3.points
                    )
                );
            case 3:
                return this.setJoueur4(
                    new SearchParamsJoueur(
                        this.joueur4.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    [...combinaison.pieces, piece],
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur4.vent,
                        this.joueur4.name,
                        this.joueur4.points
                    )
                );
            default:
                throw new Error("index must be between 0 and 3");
        }
    
    }

    /**
     * remove a piece to a combinaison
     * @param pieceIndex the index of the piece to remove
     * @param combiSelected the combinaison index and the player index
     * @returns the new game state
     */
    removePiece(pieceIndex : number, combiSelected: CombiSelected) : GameSearchParamsCalculator {
        switch(combiSelected.playerIndex){
            case 0:
                return this.setJoueur1(
                    new SearchParamsJoueur(
                        this.joueur1.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    combinaison.pieces.filter((_, i_filter) => i_filter !== pieceIndex),
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur1.vent,
                        this.joueur1.name,
                        this.joueur1.points
                    )
                );
            case 1:
                return this.setJoueur2(
                    new SearchParamsJoueur(
                        this.joueur2.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    combinaison.pieces.filter((_, i_filter) => i_filter !== pieceIndex),
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur2.vent,
                        this.joueur2.name,
                        this.joueur2.points
                    )
                );
            case 2:
                return this.setJoueur3(
                    new SearchParamsJoueur(
                        this.joueur3.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    combinaison.pieces.filter((_, i_filter) => i_filter !== pieceIndex),
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur3.vent,
                        this.joueur3.name,
                        this.joueur3.points
                    )
                );
            case 3:
                return this.setJoueur4(
                    new SearchParamsJoueur(
                        this.joueur4.main.map((combinaison, i) => {
                            if(i === combiSelected.combiIndex){
                                return new Combinaison(
                                    combinaison.pieces.filter((_, i_filter) => i_filter !== pieceIndex),
                                    combinaison.exposeType,
                                );
                            }
                            return combinaison;
                        }),
                        this.joueur4.vent,
                        this.joueur4.name,
                        this.joueur4.points
                    )
                );
            default:
                throw new Error("index must be between 0 and 3");
        }
    
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
