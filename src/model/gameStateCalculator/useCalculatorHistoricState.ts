import { useState } from "react";
import { MyLogger } from "../utils/logger";
import { SearchParamsJoueur } from "./GameSearchParamsCalculator";
import { GlobalCulatorState } from "./GlobalCalculatorState";

export interface UtilitiesHistoryType {
    /**
     * add a new game state to the historic
     * @param newState the new game state
     */
    addHistoricState: (newState: GlobalCulatorState) => void;
    
    /**
     * remove the last game state from the historic
     */
    removeHistoricState: () => void;
    
    /**
     * reset the historic
     */
    getHistoricLength: () => number;

    /**
     * 
     * @param index the index of the game state to get
     * @returns the game state at the index
     */
    getHistoricState: (index: number) => GlobalCulatorState;
    
}


export interface UtilitiesActualType {
    /**
     * set the actual joueur
     * @param joueur1 the new joueur 1
     * @param joueur2 the new joueur 2
     * @param joueur3 the new joueur 3
     * @param joueur4 the new joueur 4
     */
    modifyJoueur : (
        joueur1 : SearchParamsJoueur, 
        joueur2 : SearchParamsJoueur, 
        joueur3 : SearchParamsJoueur, 
        joueur4 : SearchParamsJoueur
    ) => void;

    /**
     * 
     * @returns the last game state
     */
    getLastState: () => GlobalCulatorState;
    
    /**
     * remove the error on the actual game state
     */
    removeError : () => void;
}

/**
 * management of the historic of the game state
 * @return the historic of the game state (array of game state) and utilieties to manage it);
 */
export function useCalculatorHistoricState() : [UtilitiesActualType, UtilitiesHistoryType] {
    const [historicState, setHistoricState] = useState<GlobalCulatorState[]>([GlobalCulatorState.getDefault()]);
    MyLogger.debug("historicState : ", historicState);

    ///////////////////////////////////////////////////////////////////////:
    // history method
    ///////////////////////////////////////////////////////////////////////:

    const addHistoricState = (newState: GlobalCulatorState) => {
        setHistoricState([newState, ...historicState]);
    };

    const removeHistoricState = () => {
        setHistoricState(historicState.slice(0, historicState.length - 1));
    };

    const getHistoricLength = () => {
        return historicState.length;
    };

    const getHistoricState = (index: number) => {
        return historicState[index];
    };


    const utilitiesHistory : UtilitiesHistoryType = {
        addHistoricState,
        removeHistoricState,
        getHistoricLength,
        getHistoricState,
    };

    ///////////////////////////////////////////////////////////////////////:
    // manageActuelState method
    ///////////////////////////////////////////////////////////////////////:

    const getLastState = () => {
        return historicState[historicState.length - 1];
    };

    const removeError = () => {
        const newState = GlobalCulatorState.copyWithoutError(getLastState());
        const newHistoricState = [...historicState];
        newHistoricState[historicState.length - 1] = newState;

        setHistoricState(newHistoricState);
    };

    const modifyJoueur = (
        joueur1 : SearchParamsJoueur, 
        joueur2 : SearchParamsJoueur, 
        joueur3 : SearchParamsJoueur, 
        joueur4 : SearchParamsJoueur
    ) => {
        let newState = GlobalCulatorState.copyWithoutError(getLastState());
        newState = newState.setGameState(newState.gameState.setJoueur1(joueur1));
        newState = newState.setGameState(newState.gameState.setJoueur2(joueur2));
        newState = newState.setGameState(newState.gameState.setJoueur3(joueur3));
        newState = newState.setGameState(newState.gameState.setJoueur4(joueur4));
        const newHistoricState = [...historicState];
        newHistoricState[historicState.length - 1] = newState;
        setHistoricState(newHistoricState);
    };

    const utilitiesActual : UtilitiesActualType = {
        modifyJoueur,
        getLastState,
        removeError
    };

    return [utilitiesActual, utilitiesHistory];
}