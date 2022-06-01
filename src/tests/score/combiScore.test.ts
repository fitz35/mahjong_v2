import {calculateScoring} from "../../../src/model/scores/calculateScore";
import { Combinaison } from "../../model/dataModel/Combinaison";
import { NumeroVent } from "../../model/dataModel/dataUtils";
import { Piece } from "../../model/dataModel/Piece";

describe("CombiScore", () => {
    const joueur : NumeroVent = NumeroVent.Est;
    const dominant : NumeroVent = NumeroVent.Ouest;
    it("should return 0 for empty combi", () => {
        const combi : Combinaison[] = [
            new Combinaison([])
        ];
        expect(calculateScoring(combi, joueur, dominant)).toBe(0);
    });
});