import { calculateFlatScoring } from "../scores/calculateScore";
import { getMahjongScoring } from "../scores/mahjongDetect";
import { Combinaison } from "./Combinaison";
import { MahjongScoring, NumeroVent } from "./dataUtils";

export class Joueur {
    private scoreBeforeRedistribution = 0;
    private scoreInCurrentManche = 0;

    // take an array of combinaison, his vent, his name, an array of score for each manche
    constructor(
        public readonly combinaisons: Array<Combinaison>,
        public readonly vent: NumeroVent,
        public readonly name: string,
        public readonly scores: Array<number>
    ) {
        this.combinaisons = combinaisons;
        this.vent = vent;
        this.name = name;
        this.scores = scores;
    }



    getCurrentMancheScore(): number {
        return this.scoreInCurrentManche;
    }

    addToCurrentMancheScore(score: number): void {
        this.scoreInCurrentManche += score;
    }

    /**
     * set the point of this player before redistribution
     * @param mahjong if this player has mahjong
     * @param dominant the dominant vent
     */
    setFlatScoring(mahjong : boolean, dominant: NumeroVent): void {
        this.scoreBeforeRedistribution =  calculateFlatScoring(this.combinaisons, this.vent, dominant, mahjong);
        this.scoreInCurrentManche = 0;
    }

    getScoreBeforeRedistribution(): number {
        return this.scoreBeforeRedistribution;
    }

    
    //////////////////////////////////////////////////////////////////////
    // display
    //////////////////////////////////////////////////////////////////////


    /**
     * get the mahjong scoring possible with the array of combinaison
     */
    getMahjongScoring(dominant: NumeroVent): MahjongScoring[] {
        return getMahjongScoring(this.combinaisons, this.vent, dominant);
    }
}
