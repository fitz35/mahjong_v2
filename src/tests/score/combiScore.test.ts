import "reflect-metadata";
import {
    calculateCombiScore,
    CombiScore,
} from "../../../src/model/scores/calculateScore";
import { Combinaison, CombinaisonExposeType } from "../../model/dataModel/Combinaison";
import { NumeroVent } from "../../model/dataModel/dataUtils";
import { Piece } from "../../model/dataModel/Piece";
import { CombiScoringRule } from "../../model/rules/interfacesScoringRules";
import { getCombiRulesByName } from "../../model/rules/readScoringRules";

/**
 *
 * @param names the names of the combi scoring rule
 * @param visibles if the combinaison is visibles
 * @returns the combined combi scoring rule
 */
function getCombinaisonScoreWithNames(
    names: string[],
    visibles: boolean[]
): CombiScore {
    const combiScore: CombiScore = {
        addition: 0,
        multiplicateur: 0,
    };
    for (let i = 0; i < names.length; i++) {
        const rule: CombiScoringRule | undefined = getCombiRulesByName(
            names[i]
        );
        if (rule !== undefined) {
            if (visibles[i]) {
                combiScore.addition += rule.open;
            } else {
                combiScore.addition += rule.hidden;
            }
            combiScore.multiplicateur += rule.multiplicator;
        }
    }
    return combiScore;
}

describe("CombiScore", () => {
    const joueur: NumeroVent = NumeroVent.Est;
    const dominant: NumeroVent = NumeroVent.Ouest;
    it("should return 0 for empty combi", () => {
        const combi: Combinaison[] = [new Combinaison([], joueur, dominant)];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames([], [])
        );
    });
    it("should be 2 normal brelan and a suite = add : 4, mult : 0", () => {
        const combi: Combinaison[] = [
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ],
            joueur,
            dominant
            ),
            new Combinaison([
                new Piece("3C"),
                new Piece("3C"),
                new Piece("3C"),
            ],
            joueur,
            dominant
            ),
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ],
            joueur,
            dominant
            ),
        ];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames(
                ["Brelan", "Brelan", "Suite"],
                [true, true, true]
            )
        );
    });
    it("should be a normal brelan and a undefined combi = add : 2, mult : 0", () => {
        const combi: Combinaison[] = [
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ],
            joueur,
            dominant
            ),
            new Combinaison(
                [new Piece("1C")],
                joueur,
                dominant
            ),
        ];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames(["Brelan"], [true])
        );
    });
    it("should be a normal brelan and a saison of the player = add : 6, mult : 2", () => {
        const combi: Combinaison[] = [
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ],
            joueur,
            dominant
            ),
            new Combinaison([new Piece("1S")],
                joueur,
                dominant
            ),
        ];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames(
                ["Brelan", "honneur du joueur"],
                [true, true]
            )
        );
    });
    it("should be a dominant vent : ", () => {
        const combi: Combinaison[] = [
            new Combinaison([
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
            ],
            joueur,
            dominant
            ),
        ];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames(
                ["Brelan de vents ou de dragons dominant"],
                [true]
            )
        );
    });
    it("should be 2 honnor and 1 honnor of the player", () => {
        const combi: Combinaison[] = [
            new Combinaison([
                new Piece("1S"),
                new Piece("2S"),
                new Piece("3S"),
            ],
            joueur,
            dominant
            ),
        ];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames(
                ["honneur", "honneur", "honneur du joueur"],
                [true, true, true]
            )
        );
    });
    it("should be a carre of dragon, a suite and a carre of honnor", () => {
        const combi: Combinaison[] = [
            new Combinaison([
                new Piece("BD"),
                new Piece("BD"),
                new Piece("BD"),
                new Piece("BD"),
            ],
            joueur,
            dominant
            ),
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ],
            joueur,
            dominant
            ),
            new Combinaison([
                new Piece("1F"),
                new Piece("2F"),
                new Piece("3F"),
                new Piece("4F"),
            ],
            joueur,
            dominant
            ),
        ];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames(
                ["honneur Carre", "Suite", "Carre de vents ou de dragons"],
                [true, true, true]
            )
        );
    });
    it("should be a carre of dragon hidden, a suite and a carre of honnor", () => {
        const combi: Combinaison[] = [
            new Combinaison([
                new Piece("BD"),
                new Piece("BD"),
                new Piece("BD"),
                new Piece("BD"),
            ],
            joueur,
            dominant, 
            CombinaisonExposeType.HIDDEN
            ),
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ],
            joueur,
            dominant
            ),
            new Combinaison([
                new Piece("1F"),
                new Piece("2F"),
                new Piece("3F"),
                new Piece("4F"),
            ],
            joueur,
            dominant
            ),
        ];
        expect(calculateCombiScore(combi)).toStrictEqual(
            getCombinaisonScoreWithNames(
                ["honneur Carre", "Suite", "Carre de vents ou de dragons"],
                [true, true, false]
            )
        );
    });
});
