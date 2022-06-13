import "reflect-metadata";
import { Combinaison } from "../../model/dataModel/Combinaison";
import { isMahjongTrouble } from "../../model/scores/mahjongDetect";
import { Piece } from "../../model/dataModel/Piece";
import {
    Famille,
    MahjongScoring,
    NumeroVent,
} from "../../model/dataModel/dataUtils";
// test isMahjongTrouble algorithme
describe("Test the isMahjongTrouble algorithme", () => {
    const joueur: NumeroVent = NumeroVent.Est;
    const dominant: NumeroVent = NumeroVent.Ouest;
    it("should not be a mahjong trouble if the array is empty", () => {
        const combinaisons: Combinaison[] = [];
        expect(isMahjongTrouble(combinaisons)).toBe(
            undefined
        );
    });
    it("should be a color trouble with one combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Bambou),
                new Piece("1", Famille.Bambou),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(
            MahjongScoring.Trouble
        );
    });
    it("should be a color trouble with two combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Bambou),
                new Piece("1", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2", Famille.Bambou),
                new Piece("2", Famille.Bambou),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(
            MahjongScoring.Trouble
        );
    });
    it("should be a color trouble with three combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Bambou),
                new Piece("1", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2", Famille.Bambou),
                new Piece("2", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(
            MahjongScoring.Trouble
        );
    });
    it("should be a color trouble with four combi, with one of dragon", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Bambou),
                new Piece("1", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2", Famille.Bambou),
                new Piece("2", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(
            MahjongScoring.Trouble
        );
    });
    it("should be a color trouble with four combi, with one of vent", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Bambou),
                new Piece("1", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2", Famille.Bambou),
                new Piece("2", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("E", Famille.Vent),
                new Piece("E", Famille.Vent),
                new Piece("E", Famille.Vent),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(
            MahjongScoring.Trouble
        );
    });
    it("should be a color trouble with four combi, with one of dragon and one of saison", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Bambou),
                new Piece("1", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Saison),
                new Piece("4", Famille.Saison),
                new Piece("2", Famille.Saison),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(
            MahjongScoring.Trouble
        );
    });
    it("should not be a mahjong trouble with four combi, with one of dragon and one of saison because there is a combi undefined", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Caractere),
                new Piece("1", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Saison),
                new Piece("4", Famille.Saison),
                new Piece("2", Famille.Saison),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(undefined);
    });
    it("should not be a mahjong trouble with four combi, with one of dragon and one of saison because there is a combi of character", () => {
        const toTest = [
            new Combinaison([
                new Piece("1", Famille.Caractere),
                new Piece("1", Famille.Caractere),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("3", Famille.Bambou),
            ], joueur, dominant),
            new Combinaison([
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
                new Piece("R", Famille.Dragon),
            ], joueur, dominant),
            new Combinaison([
                new Piece("3", Famille.Saison),
                new Piece("4", Famille.Saison),
                new Piece("2", Famille.Saison),
            ], joueur, dominant),
        ];
        expect(isMahjongTrouble(toTest)).toBe(undefined);
    });
});
