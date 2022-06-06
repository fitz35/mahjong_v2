import { UserException } from "../../error/user/UserException";
import {
    defaultGameSearchParamsCalculator,
    GameSearchParamsCalculator
} from "./GameSearchParamsCalculator";

/**
 * calculator state
 */
export class GlobalCulatorState {
    private error: UserException | undefined;

    constructor(
        public readonly gameState: GameSearchParamsCalculator,
        error: UserException | undefined = undefined
    ) {
        this.error = error;
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
        return new GlobalCulatorState(defaultGameSearchParamsCalculator, error);
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
