import { useState } from "react";
import { Combinaison } from "../dataModel/Combinaison";
import { NumeroVent } from "../dataModel/dataUtils";
import { Piece } from "../dataModel/Piece";
import { MancheCalculatorState, JoueurCalculatorState } from "./MancheCalculatorState";
import { GlobalCulatorState } from "./GlobalCalculatorState";
import { convertHistoricAsSearchParams } from "./GameStateSearchParamsUtilities";


/**
 * represente a combi to be selected
 */
export interface CombiSelected {
    playerIndex: number;
    combiIndex: number;
}

export interface UtilitiesHistoryType {

    /**
     * replace the current historic with the given one
     */
    replaceHistoricState : (newState: GlobalCulatorState[]) => void;

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

    /**
     * get the state as a string to be the url
     */
     getAsSearchParams : () => string;
    
}


export interface UtilitiesActualType {
    /**
     * set the actual joueur
     * @param joueur1 the new joueur 1
     * @param joueur2 the new joueur 2
     * @param joueur3 the new joueur 3
     * @param joueur4 the new joueur 4
     */
    modifyActuParams : (
        joueur1 : JoueurCalculatorState, 
        joueur2 : JoueurCalculatorState, 
        joueur3 : JoueurCalculatorState, 
        joueur4 : JoueurCalculatorState,
        dominant : NumeroVent
    ) => void;
    
    /**
     * add a combinaison to a joueur
     * @param combinaison the combinaison to add
     * @param joueurIndex the joueur to add the combinaison to
     */
    addCombinaison : (combinaison : Combinaison, joueurIndex : number) => void;

    /**
     * remove a combinaison from a joueur
     * @param combi the combi to remove (combinaisonIndex the combinaison index to remove, joueurIndex the joueur to remove the combinaison from)
     */
    removeCombinaison : (combi : CombiSelected) => void;

    /**
     * get a combinaison from a joueur
     * @param combi the combi to get (combinaisonIndex the combinaison index to get, joueurIndex the joueur to get the combinaison from)
     * @returns the combinaison
     */
    getCombinaison: (combi : CombiSelected) => Combinaison;

    /**
     * add a piece to a combi and a joueur
     * @param piece the piece to add
     * @param combi the combi to add the piece to (joueurIndex and combiIndex)
     */
    addPieceInCombinaison : (piece : Piece, combi : CombiSelected) => void;

    /**
     * remove a piece from a combi and a joueur
     * @param pieceIndex the index of the piece to remove
     * @param combi the combi to remove the piece from (joueurIndex and combiIndex)
     */
    removePieceInCombinaison : (pieceIndex : number, combi : CombiSelected) => void;

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

    ///////////////////////////////////////////////////////////////////////:
    // history method
    ///////////////////////////////////////////////////////////////////////:

    const replaceHistoricState = (newState: GlobalCulatorState[]) => {
        setHistoricState(newState);
    };

    const addHistoricState = (newState: GlobalCulatorState) => {
        setHistoricState([...historicState, newState]);
    };

    const removeHistoricState = () => {
        setHistoricState(historicState.slice(0, historicState.length - 2));
    };

    const getHistoricLength = () => {
        return historicState.length;
    };

    const getHistoricState = (index: number) => {
        return historicState[index];
    };

    const getAsSearchParams = () => {
        return convertHistoricAsSearchParams(historicState);
    };



    const utilitiesHistory : UtilitiesHistoryType = {
        replaceHistoricState,
        addHistoricState,
        removeHistoricState,
        getHistoricLength,
        getHistoricState,
        getAsSearchParams
    };

    ///////////////////////////////////////////////////////////////////////:
    // manageActuelState method
    ///////////////////////////////////////////////////////////////////////:

    // private 

    const modifyLastState = (newState : GlobalCulatorState) => {
        const newHistoricState = [...historicState];
        newHistoricState[historicState.length - 1] = newState;

        setHistoricState(newHistoricState);
    };


    // public



    const getLastState = () => {
        return historicState[historicState.length - 1];
    };

    const removeError = () => {
        const newState = GlobalCulatorState.copyWithoutError(getLastState());
        modifyLastState(newState);
    };

    const modifyActuParams = (
        joueur1 : JoueurCalculatorState, 
        joueur2 : JoueurCalculatorState, 
        joueur3 : JoueurCalculatorState, 
        joueur4 : JoueurCalculatorState,
        dominant : NumeroVent
    ) => {
        let newState = GlobalCulatorState.copyWithoutError(getLastState());
        newState = newState.setGameState(
            new MancheCalculatorState(joueur1, joueur2, joueur3, joueur4, dominant, false)
        );
        modifyLastState(newState);
    };

    const getCombinaison = (combi : CombiSelected) => {
        let joueur : JoueurCalculatorState;
        switch(combi.playerIndex) {
            case 0:
                joueur = getLastState().gameState.joueur1;
                break;
            case 1:
                joueur = getLastState().gameState.joueur2;
                break;
            case 2:
                joueur = getLastState().gameState.joueur3;
                break;
            case 3:
                joueur = getLastState().gameState.joueur4;
                break;
            default:
                throw new Error("playerIndex is not valid");
        }

        return joueur.main[combi.combiIndex];
    };

    const addCombinaison = (combinaison : Combinaison, joueurIndex : number) => {
        const oldState = getLastState();
        let newState = GlobalCulatorState.copyWithoutError(oldState);
        newState = newState.setGameState(
            oldState.gameState.addCombinaison(joueurIndex, combinaison)
        );
        modifyLastState(newState);
    };

    const removeCombinaison = (combi : CombiSelected) => {
        //MyLogger.debug("removeCombinaison : ", combi.playerIndex, combi.combiIndex);
        const oldState = getLastState();
        let newState = GlobalCulatorState.copyWithoutError(oldState);
        newState = newState.setGameState(
            oldState.gameState.removeCombinaison(combi.playerIndex, combi.combiIndex)
        );
        modifyLastState(newState);
    };

    const addPieceInCombinaison = (piece : Piece, combi : CombiSelected) => {
        const oldState = getLastState();
        let newState = GlobalCulatorState.copyWithoutError(oldState);
        newState = newState.setGameState(
            oldState.gameState.addPiece(combi, piece)
        );
        modifyLastState(newState);
    };

    const removePieceInCombinaison = (pieceIndex : number, combi : CombiSelected) => {
        const oldState = getLastState();
        let newState = GlobalCulatorState.copyWithoutError(oldState);
        newState = newState.setGameState(
            oldState.gameState.removePiece(pieceIndex, combi)
        );
        modifyLastState(newState);
    };

    const utilitiesActual : UtilitiesActualType = {
        modifyActuParams,
        getLastState,
        removeError,
        getCombinaison,
        addCombinaison,
        removeCombinaison,
        addPieceInCombinaison,
        removePieceInCombinaison
    };

    return [utilitiesActual, utilitiesHistory];
}