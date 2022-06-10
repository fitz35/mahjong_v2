import "reflect-metadata";
import { Combinaison } from "../../model/dataModel/Combinaison";
import { isMahjongPairBrelanSuite } from "../../model/scores/mahjongDetect";
import { Piece } from "../../model/dataModel/Piece";
import { MahjongScoring, NumeroVent } from "../../model/dataModel/dataUtils";

// test the isMahjongOnlyPairBrelanCarre function
describe(" Test the isMahjongOnlyPairBrelanCarre algo", () => {
    const joueur: NumeroVent = NumeroVent.Est;
    const dominant: NumeroVent = NumeroVent.Ouest;
    it("should return undefined if the array is empty", () => {
        const combinaisons: Combinaison[] = [];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            undefined
        );
    });
    it("Should be a mahjong only of pair", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([new Piece("1R"), new Piece("1R")]),
            new Combinaison([new Piece("1R"), new Piece("1R")]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            MahjongScoring.OnlyPaire
        );
    });
    it("Should be a mahjong only of brelan", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ]),
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            MahjongScoring.OnlyBrelan
        );
    });
    it("Should be a mahjong only of suite", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ]),
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            MahjongScoring.OnlySuite
        );
    });
    it("Should not be a mahjong only of pair with a honneur", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([new Piece("1R"), new Piece("1R")]),
            new Combinaison([new Piece("1R"), new Piece("1R")]),
            new Combinaison([new Piece("1S"), new Piece("2S")]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            MahjongScoring.OnlyPaire
        );
    });
    it("Should not be a mahjong only of brelan with a honneur", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([new Piece("1S"), new Piece("2S")]),
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ]),
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            MahjongScoring.OnlyBrelan
        );
    });
    it("Should not be a mahjong only of suite with a honneur", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([new Piece("1S"), new Piece("2S")]),
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ]),
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            MahjongScoring.OnlySuite
        );
    });
    it("Should not be a mahjong only of pair because of a brelan", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([new Piece("1R"), new Piece("1R")]),
            new Combinaison([new Piece("1R"), new Piece("1R")]),
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            undefined
        );
    });
    it("Should not be a mahjong only of suite because of a brelan", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ]),
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ]),
            new Combinaison([
                new Piece("1R"),
                new Piece("2R"),
                new Piece("3R"),
            ]),
        ];
        expect(isMahjongPairBrelanSuite(combinaisons, joueur, dominant)).toBe(
            undefined
        );
    });
});
