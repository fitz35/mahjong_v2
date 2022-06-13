import "reflect-metadata";
import { Combinaison } from "../../model/dataModel/Combinaison";
import { isMahjongFullColor } from "../../model/scores/mahjongDetect";
import { Piece } from "../../model/dataModel/Piece";
import { MahjongScoring, NumeroVent } from "../../model/dataModel/dataUtils";

// test isMahjongFullColor algorithme
describe("Test isMahjongFullColor algorithme", () => {
    const joueur: NumeroVent = NumeroVent.Est;
    const dominant: NumeroVent = NumeroVent.Ouest;
    it("should not be a mahjong full color because there is no combinaison", () => {
        const combinaisons: Combinaison[] = [];
        expect(isMahjongFullColor(combinaisons)).toBe(
            undefined
        );
    });
    it("Should say it is a pur color with 1 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(
            MahjongScoring.CouleurPur
        );
    });
    it("Should say it is a pur color with 2 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(
            MahjongScoring.CouleurPur
        );
    });
    it("Should say it is a pur color with 3 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1C"),
                new Piece("2C"),
                new Piece("3C"),
                new Piece("4C"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(
            MahjongScoring.CouleurPur
        );
    });
    it("Should say it is not a pur color with 2 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2R"),
                new Piece("2R"),
                new Piece("2R"),
                new Piece("2R"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
    it("Should say it is not a pur color with 3 combi,with a combi no define", () => {
        const toTest = [
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1R"),
                new Piece("2C"),
                new Piece("3C"),
                new Piece("4C"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
    it("Should say it is not a pur color with 3 combi,with a combi no define at the begining", () => {
        const toTest = [
            new Combinaison([
                new Piece("1R"),
                new Piece("2C"),
                new Piece("3C"),
                new Piece("4C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
    it("Should say it is not a pur color with 3 combi,with all combi no define", () => {
        const toTest = [
            new Combinaison([
                new Piece("1R"),
                new Piece("2C"),
                new Piece("3C"),
                new Piece("4C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1R"),
                new Piece("2C"),
                new Piece("3C"),
                new Piece("4C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1R"),
                new Piece("2C"),
                new Piece("3C"),
                new Piece("4C"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
    it("Should say it is a pur color with honnor", () => {
        const toTest = [
            new Combinaison([
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
                new Piece("1C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
                new Piece("2C"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1C"),
                new Piece("2C"),
                new Piece("3C"),
                new Piece("4C"),
            ], joueur, dominant),
            new Combinaison([new Piece("1F")], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(
            MahjongScoring.CouleurPur
        );
    });
    // same tests with famille Vent and Dragon for the OnlyDragonAndVent Mahjong
    it("should say it is a ventOuDragon color with 1 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(
            MahjongScoring.OnlyDragonAndVent
        );
    });
    it("should say it is a ventOuDragon color with 2 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(
            MahjongScoring.OnlyDragonAndVent
        );
    });
    it("should say it is a ventOuDragon color with 3 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("NV"),
                new Piece("NV"),
                new Piece("NV"),
                new Piece("NV"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(
            MahjongScoring.OnlyDragonAndVent
        );
    });
    it("should say it is not a ventOuDragon color with 2 combi", () => {
        const toTest = [
            new Combinaison([
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("2R"),
                new Piece("2R"),
                new Piece("2R"),
                new Piece("2R"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
    it("should say it is not a ventOuDragon color with 3 combi,with a combi no define", () => {
        const toTest = [
            new Combinaison([
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1R"),
                new Piece("OV"),
                new Piece("NV"),
                new Piece("SV"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
    it("should say it is not a ventOuDragon color with 3 combi,with a combi no define at the begining", () => {
        const toTest = [
            new Combinaison([
                new Piece("1R"),
                new Piece("OV"),
                new Piece("NV"),
                new Piece("SV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
                new Piece("EV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
                new Piece("OV"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
    it("should say it is not a ventOuDragon color with 3 combi,with all combi no define", () => {
        const toTest = [
            new Combinaison([
                new Piece("1R"),
                new Piece("OV"),
                new Piece("NV"),
                new Piece("SV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1R"),
                new Piece("OV"),
                new Piece("NV"),
                new Piece("SV"),
            ], joueur, dominant),
            new Combinaison([
                new Piece("1R"),
                new Piece("OV"),
                new Piece("NV"),
                new Piece("SV"),
            ], joueur, dominant),
        ];
        expect(isMahjongFullColor(toTest)).toBe(undefined);
    });
});
