import { UserException } from "../../error/user/UserException";
import {
    JoueurCalculatorState,
    mancheCalculatorInitialState,
    MancheCalculatorState
} from "./MancheCalculatorState";
import piecesInAGame from "../../data/piecesInAGame.json";
import { getJoueurGenerator } from "../utils/joueursUtils";
import { Piece } from "../dataModel/Piece";

interface piecesInAGameType {
    [key: string]: number
}

/**
 * calculator state
 */
export class GlobalCulatorState {
    private error: UserException | undefined;

    private piecesInGame: piecesInAGameType;

    constructor(
        public readonly gameState: MancheCalculatorState,
        error: UserException | undefined = undefined
    ) {
        this.error = error;
        this.piecesInGame = {
            ...piecesInAGame
        };
        // remove every piece from the game
        const joueurGenerator = getJoueurGenerator<JoueurCalculatorState, MancheCalculatorState>(this.gameState);
        for (const [joueur,] of joueurGenerator) {
            for (const combi of joueur.main) {
                for(const piece of combi.pieces) {
                    this.piecesInGame[piece.getCode()]--;
                }
            }
        }
    }


    // set a new game state and return a new calculator state
    public setGameState(gameState: MancheCalculatorState): GlobalCulatorState {
        return new GlobalCulatorState(gameState);
    }

    //////////////////////////////////////////////////////
    // piece management
    //////////////////////////////////////////////////////
    /**
     * if a piece is in the game, return true
     * @param piece the piece to check
     * @returns 
     */
    public isPieceInGame(piece: Piece): boolean {
        return this.piecesInGame[piece.getCode()] > 0;
    }

    /**
     * return the number of pieces in the game
     * @param piece the piece to check
     * @returns the number of pieces in the game
     */
    public getAmountOfPiece(piece: Piece): number {
        return this.piecesInGame[piece.getCode()];
    }

    //////////////////////////////////////////////////////
    // get default
    //////////////////////////////////////////////////////

    /**
     *
     * @returns the default game state
     */
    public static getDefault(
        error: UserException | undefined = undefined
    ): GlobalCulatorState {
        return new GlobalCulatorState(mancheCalculatorInitialState, error);
    }

    /**
     *
     * @param calculatorState the original calculator state
     * @returns the calculator state without any error
     */
    public static copyWithoutError(
        calculatorState: GlobalCulatorState
    ): GlobalCulatorState {
        return new GlobalCulatorState(calculatorState.gameState, undefined);
    }

    //////////////////////////////////////////////////////
    // error management
    //////////////////////////////////////////////////////

    /**
     *
     * @returns true if there is an error
     */
    public isError(): boolean {
        return this.error !== undefined;
    }

    /**
     *
     * @returns the error
     */
    public getError(): UserException | undefined {
        return this.error;
    }

    /**
     *
     * @param error set the error
     */
    public setError(error: UserException | undefined): void {
        this.error = error;
    }
}
