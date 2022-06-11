import { Expose, plainToInstance } from "class-transformer";
import { transformAndValidate } from "class-transformer-validator";
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsBoolean,
    IsIn,
    IsString,
    Length,
    ValidateNested,
} from "class-validator";
import {
    Combinaison,
    CombinaisonExposeType,
} from "../../model/dataModel/Combinaison";
import { Famille, NumeroVent } from "../../model/dataModel/dataUtils";
import { Piece } from "../../model/dataModel/Piece";
import {
    MancheCalculatorState,
    JoueurCalculatorState
} from "../../model/gameStateCalculator/MancheCalculatorState";
import { getJoueurGenerator } from "../../model/utils/joueursUtils";
import { MyLogger } from "../../model/utils/logger";

////////////////////////////////////////////////////////////////////
// plain object tobe in the param
///////////////////////////////////////////////////////////////////

class SearchParamsPiece {
    @Expose()
    @IsString()
    @Length(1, 1)
    public numero = "";
    @Expose()
    @IsString()
    @Length(1, 1)
    public famille = "";
}

class SearchParamsCombinaison {
    @Expose()
    @ValidateNested()
    public pieces: SearchParamsPiece[] = [];

    @Expose()
    @IsString()
    @IsIn(["visible", "hidden", "honnor"])
    public exposeType = "";
}

class SearchParamsJoueur {
    @Expose()
    @ValidateNested()
    public main: SearchParamsCombinaison[] = [];
    @Expose()
    @ValidateNested()
    public points: number[] = [];
    @Expose()
    @IsString()
    public name = "";
    @Expose()
    @IsString()
    @Length(1, 1)
    public numeroVent = "";
}

class SearchParamsManche {
    @Expose()
    @ValidateNested()
    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    public joueurs: SearchParamsJoueur[] = [];
    @Expose()
    @IsString()
    @Length(1, 1)
    public dominant = "";
    @Expose()
    @IsBoolean()
    public isDefault = false;
}

/**
 * convert a plain object to a game state
 * @param initManche the plain object
 * @returns the game state
 */
function convertSearchParamsToState(
    initManche: SearchParamsManche
): MancheCalculatorState {
    const joueurs: JoueurCalculatorState[] = initManche.joueurs.map(
        (joueur: SearchParamsJoueur) => {
            return new JoueurCalculatorState(
                joueur.main.map((combinaison: SearchParamsCombinaison) => {
                    return new Combinaison(
                        combinaison.pieces.map((piece: SearchParamsPiece) => {
                            return new Piece(
                                piece.numero,
                                piece.famille as Famille
                            );
                        }),
                        combinaison.exposeType as CombinaisonExposeType
                    );
                }),
                joueur.numeroVent as NumeroVent,
                joueur.name,
                joueur.points
            );
        }
    );
    return new MancheCalculatorState(
        joueurs[0],
        joueurs[1],
        joueurs[2],
        joueurs[3],
        initManche.dominant as NumeroVent,
        initManche.isDefault
    );
}

export const defaultMancheSearchParamsCalculator: SearchParamsManche =
    plainToInstance(SearchParamsManche, {
        joueurrs: [
            {
                main: [],
                vent: NumeroVent.Est as string,
                points: [],
                name: "Joueur 1",
            },
            {
                main: [],
                vent: NumeroVent.Sud as string,
                points: [],
                name: "Joueur 2",
            },
            {
                main: [],
                vent: NumeroVent.Ouest as string,
                points: [],
                name: "Joueur 3",
            },
            {
                main: [],
                vent: NumeroVent.Nord as string,
                points: [],
                name: "Joueur 4",
            },
        ],
        dominantVent: NumeroVent.Est as string,
        isDefault: true,
    });

////////////////////////////////////////////////////////////////////
// check param fonction
///////////////////////////////////////////////////////////////////

/**
 *
 * @param ventOfPlayer the vent of the player
 * @returns if the vent is valid
 */
export function checkVentCoherence(
    gameParamsCalculator: MancheCalculatorState
): boolean {
    let invalidVent = false;
    const ventArray: NumeroVent[] = [
        NumeroVent.Est,
        NumeroVent.Sud,
        NumeroVent.Ouest,
        NumeroVent.Nord,
    ];
    const players = getJoueurGenerator<
        JoueurCalculatorState,
        MancheCalculatorState
    >(gameParamsCalculator);
    for (const [player] of players) {
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
        } else {
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
    gameParamsCalculator: MancheCalculatorState
): boolean {
    let invalidPoint = false;
    let pointsRef: number | undefined = undefined;
    const players = getJoueurGenerator<
        JoueurCalculatorState,
        MancheCalculatorState
    >(gameParamsCalculator);
    for (const [player] of players) {
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
        } else {
            invalidPoint = true;
            break;
        }
    }
    return !invalidPoint;
}

///////////////////////////////////////////////////////////////////
// conversion
///////////////////////////////////////////////////////////////////



/**
 * 
 * @returns the game state from the search params
 */
export function getGameSearchParamsCalculatorKey() : string {
    return "state";
}

export async function convertUrlSearchParamsInGameParamsCalculator(
    searchParams: URLSearchParams
): Promise<MancheCalculatorState | undefined> {
    const jsonString = searchParams.get(getGameSearchParamsCalculatorKey());
    // get the json string
    if (jsonString !== null) {
        // try to parse the json string
        try {
            const SearchParamsCalculator: SearchParamsManche =
                (await transformAndValidate(
                    SearchParamsManche,
                    JSON.parse(jsonString)
                )) as SearchParamsManche;

            const gameState: MancheCalculatorState = convertSearchParamsToState(
                SearchParamsCalculator
            );
            // if the param is invalid, we set the default value and recharge the url
            if (
                !checkVentCoherence(gameState) ||
                !checkPointsCoherence(gameState)
            ) {
                return undefined;
            } else {
                return gameState;
            }
        } catch (e) {
            MyLogger.debug("test", e);
            return undefined;
        }
    } else {
        return undefined;
    }
}
