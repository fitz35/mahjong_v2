import { Joueur } from "./Joueur";
import { NumeroVent } from "./dataUtils";
import { JoueurCalculatorState, MancheCalculatorState } from "../gameStateCalculator/MancheCalculatorState";
import { MahjongScoringRule } from "../rules/interfacesScoringRules";
import {getMahjongScoringRulesFromId} from "../rules/readScoringRules";

/**
 * new manche
 */
export class Manche {
    private joueurs: Joueur[];

    constructor(
        public readonly dominant: NumeroVent,
        public readonly mahjongName: string,
        public readonly joueur1: Joueur,
        public readonly joueur2?: Joueur,
        public readonly joueur3?: Joueur,
        public readonly joueur4?: Joueur,
        public readonly mahjongUndected: MahjongScoringRule | undefined = undefined
    ) {
        this.joueurs = [];

        this.joueurs.push(joueur1);
        if (joueur2) {
            this.joueurs.push(joueur2);
        }
        if (joueur3) {
            this.joueurs.push(joueur3);
        }
        if (joueur4) {
            this.joueurs.push(joueur4);
        }
        this.dispatchPoint();
    }

    /**
     * 
     * @param index the index of the player
     * @returns the player
     */
    getPlayerByIndex(index: number): Joueur {
        return this.joueurs[index];
    }

    /**
     * get a player by his name
     * @param name the name of the player
     * @returns the player
     */
    private getPlayer(name: string): number | undefined {
        for (let i = 0; i < this.joueurs.length; i++) {
            if (this.joueurs[i].name === name) {
                return i;
            }
        }
        return undefined;
    }

    /**
     * dispatch the point to the player
     */
    private dispatchPoint(): void {
        const mahjongPlayerI = this.getPlayer(this.mahjongName);
        if (mahjongPlayerI !== undefined) {
            // begin to assign for each player the flat point (before redistribution)
            for (let i = 0; i < this.joueurs.length; i++) {
                this.joueurs[i].setFlatScoring(
                    i === mahjongPlayerI,
                    this.dominant,
                    this.mahjongUndected
                );
            }

            /**
             * the scoring of the player who has mahjong
             */
            const mahjong_scoring =
                this.joueurs[mahjongPlayerI].getScoreBeforeRedistribution();

            // if the mahjong player is Est
            if (this.joueurs[mahjongPlayerI].vent === NumeroVent.Est) {
                // assign the point to the player
                for (let i = 0; i < this.joueurs.length; i++) {
                    if (i === mahjongPlayerI) {
                        // assign 6* the point to the mahjong player (every other player give 2* the point to the mahjong player)
                        this.joueurs[mahjongPlayerI].addToCurrentMancheScore(
                            6 * mahjong_scoring
                        );
                    } else {
                        // assign the point to the other player
                        this.joueurs[i].addToCurrentMancheScore(
                            -2 * mahjong_scoring
                        );
                    }
                }
            } else {
                // if this isn't Est the maahjong player, the mahjong player get 4* the point, the est player give 2* the point, and
                // the other player give 1* the point
                for (let i = 0; i < this.joueurs.length; i++) {
                    if (i === mahjongPlayerI) {
                        this.joueurs[mahjongPlayerI].addToCurrentMancheScore(
                            4 * mahjong_scoring
                        );
                    } else if (this.joueurs[i].vent === NumeroVent.Est) {
                        this.joueurs[i].addToCurrentMancheScore(
                            -2 * mahjong_scoring
                        );
                    } else {
                        this.joueurs[i].addToCurrentMancheScore(
                            -1 * mahjong_scoring
                        );
                    }
                }
            }

            // after, the no-mahjong players exchange each other's point
            // get the no-mahjong players
            const no_mahjong_players: Joueur[] = [];
            for (let i = 0; i < this.joueurs.length; i++) {
                if (i !== mahjongPlayerI) {
                    no_mahjong_players.push(this.joueurs[i]);
                }
            }

            //(for each pair of players, the player with the lowest point give the point to the player with the highest point)
            for (let i = no_mahjong_players.length - 1; i >= 0; i--) {
                for (let j = 0; j < i; j++) {
                    // calculate the difference
                    let difference: number =
                        no_mahjong_players[i].getScoreBeforeRedistribution() - 
                        no_mahjong_players[j].getScoreBeforeRedistribution();
                    // if the est is involved, the difference is doubled
                    if (
                        no_mahjong_players[i].vent === NumeroVent.Est ||
                        no_mahjong_players[j].vent === NumeroVent.Est
                    ) {
                        difference *= 2;
                    }

                    // the player with the lowest point give the point to the player with the highest point
                    // (if i is the player with the highest point, the difference is positive, so i receive the difference and j lose it)
                    // (if j is the player with the highest point, the difference is negative, so j receive the difference and i lose it)
                    no_mahjong_players[i].addToCurrentMancheScore(difference);
                    no_mahjong_players[j].addToCurrentMancheScore(-difference);
                }
            }
        }
    }
}


function convertPlayerStateToJoueur(player: JoueurCalculatorState): Joueur {
    return new Joueur(
        player.main,
        player.vent,
        player.name,
        player.points,
    );
}

export function convertMancheStateToManche(mancheState : MancheCalculatorState) : Manche | undefined {
    if(mancheState.mahjongPlayer !== undefined) {
        return new Manche(
            mancheState.dominantVent,
            mancheState.mahjongPlayer,
            convertPlayerStateToJoueur(mancheState.joueur1),
            convertPlayerStateToJoueur(mancheState.joueur2),
            convertPlayerStateToJoueur(mancheState.joueur3),
            convertPlayerStateToJoueur(mancheState.joueur4),
            mancheState.mahjongUndetectedId !== undefined ? 
                getMahjongScoringRulesFromId(mancheState.mahjongUndetectedId) : undefined, 
        );
    }else{
        return undefined;
    }
    
}
