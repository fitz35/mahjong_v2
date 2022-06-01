import { getMahjongScoring } from "../scores/mahjongDetect";
import { Combinaison } from "./Combinaison";
import { MahjongScoring, NumeroVent } from "./dataUtils";

export class Joueur {
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

    /**
     * get the mahjong scoring possible with the array of combinaison
     */
    getMahjongScoring(dominant: NumeroVent): MahjongScoring[] {
        return getMahjongScoring(this.combinaisons, this.vent, dominant);
    }
}
