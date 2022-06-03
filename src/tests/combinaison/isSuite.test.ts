import { isSuite } from "../../model/scores/combinaisonDetect";
import { Piece } from "../../model/dataModel/Piece";
import { BaseCombi, Famille } from "../../model/dataModel/dataUtils";

describe("Test the isSuite algorithme", () => {
    it("Should sort the array and say it is not a suite with 2 cercle", () => {
        const toTest = [
            new Piece("1", Famille.Cercle),
            new Piece("2", Famille.Cercle),
        ];
        expect(isSuite(toTest)).toBe(undefined);
        expect(JSON.stringify(toTest)).toBe(
            JSON.stringify([
                new Piece("1", Famille.Cercle),
                new Piece("2", Famille.Cercle),
            ])
        );
    });

    it("Should sort the array and say it is not a suite with 1 cercle", () => {
        const toTest = [new Piece("2", Famille.Cercle)];
        expect(isSuite(toTest)).toBe(undefined);
        expect(JSON.stringify(toTest)).toBe(
            JSON.stringify([new Piece("2", Famille.Cercle)])
        );
    });

    it("Should sort the array and say it is a suite with 3 charactere", () => {
        const toTest = [
            new Piece("1", Famille.Caractere),
            new Piece("3", Famille.Caractere),
            new Piece("2", Famille.Caractere),
        ];
        expect(JSON.stringify(isSuite(toTest))).toBe(
            JSON.stringify({
                base: BaseCombi.Suite,
                modificateur: new Set(),
                famille: Famille.Caractere,
            })
        );
        expect(JSON.stringify(toTest)).toBe(
            JSON.stringify([
                new Piece("1", Famille.Caractere),
                new Piece("2", Famille.Caractere),
                new Piece("3", Famille.Caractere),
            ])
        );
    });

    it("Should sort the array and say it is not suite because they aren't in the same famille", () => {
        const toTest = [
            new Piece("1", Famille.Caractere),
            new Piece("3", Famille.Caractere),
            new Piece("2", Famille.Bambou),
        ];
        expect(isSuite(toTest)).toBe(undefined);
        expect(JSON.stringify(toTest)).toBe(
            JSON.stringify([
                new Piece("1", Famille.Caractere),
                new Piece("2", Famille.Bambou),
                new Piece("3", Famille.Caractere),
            ])
        );
    });

    it("Should sort the array and say it is not suite because they aren't in the same famille", () => {
        const toTest = [
            new Piece("1", Famille.Caractere),
            new Piece("3", Famille.Caractere),
            new Piece("E", Famille.Vent),
        ];
        expect(isSuite(toTest)).toBe(undefined);
        expect(JSON.stringify(toTest)).toBe(
            JSON.stringify([
                new Piece("1", Famille.Caractere),
                new Piece("3", Famille.Caractere),
                new Piece("E", Famille.Vent),
            ])
        );
    });

    it("Should sort the array and say it is a suite with 9 bambou", () => {
        const toTest = [
            new Piece("1", Famille.Bambou),
            new Piece("3", Famille.Bambou),
            new Piece("2", Famille.Bambou),
            new Piece("8", Famille.Bambou),
            new Piece("4", Famille.Bambou),
            new Piece("5", Famille.Bambou),
            new Piece("9", Famille.Bambou),
            new Piece("6", Famille.Bambou),
            new Piece("7", Famille.Bambou),
        ];
        expect(JSON.stringify(isSuite(toTest))).toBe(
            JSON.stringify({
                base: BaseCombi.Suite,
                modificateur: new Set(),
                famille: Famille.Bambou,
            })
        );
        expect(JSON.stringify(toTest)).toBe(
            JSON.stringify([
                new Piece("1", Famille.Bambou),
                new Piece("2", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("4", Famille.Bambou),
                new Piece("5", Famille.Bambou),
                new Piece("6", Famille.Bambou),
                new Piece("7", Famille.Bambou),
                new Piece("8", Famille.Bambou),
                new Piece("9", Famille.Bambou),
            ])
        );
    });

    it("Should sort the array and say it is not suite with 8 bambou and a hole", () => {
        const toTest = [
            new Piece("1", Famille.Bambou),
            new Piece("3", Famille.Bambou),
            new Piece("2", Famille.Bambou),
            new Piece("4", Famille.Bambou),
            new Piece("5", Famille.Bambou),
            new Piece("9", Famille.Bambou),
            new Piece("6", Famille.Bambou),
            new Piece("7", Famille.Bambou),
        ];
        expect(isSuite(toTest)).toBe(undefined);
        expect(JSON.stringify(toTest)).toBe(
            JSON.stringify([
                new Piece("1", Famille.Bambou),
                new Piece("2", Famille.Bambou),
                new Piece("3", Famille.Bambou),
                new Piece("4", Famille.Bambou),
                new Piece("5", Famille.Bambou),
                new Piece("6", Famille.Bambou),
                new Piece("7", Famille.Bambou),
                new Piece("9", Famille.Bambou),
            ])
        );
    });
    it("shouldn't be a suite because it isn't a suite family (fleur)", () => {
        const toTest = [
            new Piece("1", Famille.Fleurs),
            new Piece("2", Famille.Fleurs),
            new Piece("3", Famille.Fleurs),
        ];
        expect(isSuite(toTest)).toBe(undefined);
    });
    it("shouldn't be a suite because it isn't a suite family (Saison)", () => {
        const toTest = [
            new Piece("1", Famille.Saison),
            new Piece("2", Famille.Saison),
            new Piece("3", Famille.Saison),
        ];
        expect(isSuite(toTest)).toBe(undefined);
    });
});
