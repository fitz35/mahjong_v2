import { Expose, plainToInstance } from "class-transformer";
import { transformAndValidate } from "class-transformer-validator";
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsBoolean,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Length,
    ValidateNested,
} from "class-validator";
import {
    Combinaison,
    CombinaisonExposeType,
} from "../dataModel/Combinaison";
import { Famille, NumeroVent } from "../dataModel/dataUtils";
import { Piece } from "../dataModel/Piece";
import {
    MancheCalculatorState,
    JoueurCalculatorState
} from "./MancheCalculatorState";
import { getJoueurGenerator } from "../utils/joueursUtils";
import { GlobalCulatorState } from "./GlobalCalculatorState";
import { MyLogger } from "../utils/logger";

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
    public points = 0;
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

    @Expose()
    @IsString()
    @IsOptional()
    public mahjongPlayer?: string;
    @Expose()
    @IsInt()
    @IsOptional()
    public mahjongUndetectedId? : number;
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
                        joueur.numeroVent as NumeroVent,
                        initManche.dominant as NumeroVent,
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
        initManche.isDefault,
        initManche.mahjongPlayer,
        initManche.mahjongUndetectedId
    );
}

export const defaultMancheSearchParamsCalculator: SearchParamsManche =
    plainToInstance(SearchParamsManche, {
        joueurrs: [
            {
                main: [],
                vent: NumeroVent.Est as string,
                points: 0,
                name: "Joueur 1",
            },
            {
                main: [],
                vent: NumeroVent.Sud as string,
                points: 0,
                name: "Joueur 2",
            },
            {
                main: [],
                vent: NumeroVent.Ouest as string,
                points: 0,
                name: "Joueur 3",
            },
            {
                main: [],
                vent: NumeroVent.Nord as string,
                points: 0,
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

/**
 * convert the joueur state to a plain object
 * @param joueur the joueur state
 * @returns the plain object
 */
function convertJoueurToSearchParams(joueur : JoueurCalculatorState) : SearchParamsJoueur {
    return {
        main: joueur.main.map(
            (combinaison : Combinaison) => {
                return {
                    pieces: combinaison.pieces.map(
                        (piece : Piece) => {
                            return {
                                numero: piece.numero,
                                famille: piece.famille
                            };
                        }
                    ),
                    exposeType: combinaison.exposeType
                };
            }
        ),
        numeroVent: joueur.vent,
        points: joueur.points,
        name: joueur.name,
    };
}

/**
 * convert the game state to a plain object and an url query string
 * @param historics the game state
 * @returns the url query string
 */
export function convertHistoricAsSearchParams(historics : GlobalCulatorState[]) : string {
    const palinObjects : SearchParamsManche[] = historics.map(
        (historic : GlobalCulatorState) => {
            return {
                joueurs: [
                    convertJoueurToSearchParams(historic.gameState.joueur1),
                    convertJoueurToSearchParams(historic.gameState.joueur2),
                    convertJoueurToSearchParams(historic.gameState.joueur3),
                    convertJoueurToSearchParams(historic.gameState.joueur4),
                ],
                dominant: historic.gameState.dominantVent,
                isDefault: historic.gameState.isDefault,
                mahjongPlayer: historic.gameState.mahjongPlayer,
                mahjongUndetectedId: historic.gameState.mahjongUndetectedId,
            };
        }
    );

    return getGameSearchParamsCalculatorKey() + "=" + JSON.stringify(palinObjects);
}


/**
 * convert a plain object to a historic
 * @param searchParams the url search params
 * @returns the historic or undefined if the search params are invalid
 */
export async function convertUrlSearchParamsInHistoricCalculator(
    searchParams: URLSearchParams
): Promise<MancheCalculatorState[] | undefined> {
    const jsonString = searchParams.get(getGameSearchParamsCalculatorKey());
    // get the json string
    if (jsonString !== null) {
        // try to parse the json string
        try {
            const SearchParamsCalculator: SearchParamsManche[] =
                (await transformAndValidate(
                    SearchParamsManche,
                    JSON.parse(jsonString)
                )) as SearchParamsManche[];

            const gameStates: MancheCalculatorState[] = SearchParamsCalculator.map(
                (value : SearchParamsManche) : MancheCalculatorState => {
                    return convertSearchParamsToState(value);
                }
            );
            // if the param is invalid, we set the default value and recharge the url
            for(const gameState of gameStates) {
                if (
                    !checkVentCoherence(gameState)
                ) {
                    return undefined;
                }
            }
            return gameStates;
        } catch (e) {
            MyLogger.debug("error : ", e);
            return undefined;
        }
    } else {
        return undefined;
    }
}
