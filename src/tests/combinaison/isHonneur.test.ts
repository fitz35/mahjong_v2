import {isHonneur} from "../../model/pieces/Combinaison"
import { Piece } from "../../model/pieces/Piece";
import { BaseCombi, Famille } from "../../model/pieces/types";

describe('Test the isHonneur algorithme', () => {
    it("should be a combi of Fleurs", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("2", Famille.Fleurs)];
        expect(isHonneur(toTest)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set(), famille: Famille.Fleurs, number: 2});
    });
    it("should be a combi of Saison", () => {
        const toTest = [new Piece("1", Famille.Saison), new Piece("2", Famille.Saison)];
        expect(isHonneur(toTest)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set(), famille: Famille.Saison, number: 2});
    });
    it("sould be a combi with 4 fleurs", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("2", Famille.Fleurs), new Piece("3", Famille.Fleurs), new Piece("4", Famille.Fleurs)];
        expect(isHonneur(toTest)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set(), famille: Famille.Fleurs, number: 4});
    });
    it("should not be a combi of Fleurs because of the presence of two same piece", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("1", Famille.Fleurs)];
        expect(isHonneur(toTest)).toStrictEqual(undefined);
    });
    it("should not be a combi of Fleurs because of the presence of a saison", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("2", Famille.Saison)];
        expect(isHonneur(toTest)).toStrictEqual(undefined);
    });
});