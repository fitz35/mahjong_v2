import "reflect-metadata";
import { Combinaison } from "../../model/dataModel/Combinaison";
import { isMahjongOnly1or9 } from "../../model/scores/mahjongDetect";
import { Piece } from "../../model/dataModel/Piece";
import { MahjongScoring, NumeroVent } from "../../model/dataModel/dataUtils";

// test isMahjongOnly1or9 function
describe(" Test the isMahjongOnly1or9 algo", () => {
    const joueur: NumeroVent = NumeroVent.Est;
    const dominant: NumeroVent = NumeroVent.Ouest;
    it("should return undefined if the array is empty", () => {
        const combinaisons: Combinaison[] = [];
        expect(isMahjongOnly1or9(combinaisons)).toBe(
            undefined
        );
    });
    it("Should be a mahjong only of 1 or 9 with one brelan", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ], joueur, dominant),
        ];
        expect(isMahjongOnly1or9(combinaisons)).toBe(
            MahjongScoring.OnlyExtremNumero
        );
    });
    it("Should be a mahjong only of 1 or 9 with 2 carre", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
            ], joueur, dominant),
        ];
        expect(isMahjongOnly1or9(combinaisons)).toBe(
            MahjongScoring.OnlyExtremNumero
        );
    });
    it("Should be a mahjong only of 1 or 9 with 2 carre and a brelan", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
        ];
        expect(isMahjongOnly1or9(combinaisons)).toBe(
            MahjongScoring.OnlyExtremNumero
        );
    });
    it("Should be a mahjong only of 1 or 9 with 2 carre, a brelan and a honneur", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1F"),
                new Piece("2F"),
                new Piece("3F"),
            ], joueur, dominant),
        ];
        expect(isMahjongOnly1or9(combinaisons)).toBe(
            MahjongScoring.OnlyExtremNumero
        );
    });
    it("Should not be a mahjong only of 1 or 9 with a undefined combi", () => {
        const combinaisons: Combinaison[] = [
            new Combinaison([
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
                new Piece("1R"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
                new Piece("9R"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1F"),
                new Piece("1F"),
                new Piece("1F"),
            ], joueur, dominant),
        ];
        expect(isMahjongOnly1or9(combinaisons)).toBe(
            undefined
        );
    });
});
