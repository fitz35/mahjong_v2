import {isHonneur} from "../../model/pieces/Combinaison"
import { Piece } from "../../model/pieces/Piece";
import { BaseCombi, Famille, ModificateurCombi, NumeroVent } from "../../model/pieces/types";

describe('Test the isHonneur algorithme', () => {
    const joueur : NumeroVent = NumeroVent.Nord;
    it("should be a combi of fleur with one honneur", () => {
        const toTest : Piece[] = [new Piece("1",Famille.Fleurs)];
        expect(isHonneur(toTest, joueur)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set(), famille: Famille.Fleurs, number: 1});
    });
    it("should be a combi of Fleurs", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("2", Famille.Fleurs)];
        expect(isHonneur(toTest, joueur)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set(), famille: Famille.Fleurs, number: 2});
    });
    it("should be a combi of Saison", () => {
        const toTest = [new Piece("1", Famille.Saison), new Piece("2", Famille.Saison)];
        expect(isHonneur(toTest, joueur)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set(), famille: Famille.Saison, number: 2});
    });
    it("sould be a combi with 4 fleurs", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("2", Famille.Fleurs), new Piece("3", Famille.Fleurs), new Piece("4", Famille.Fleurs)];
        expect(isHonneur(toTest, joueur)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set([ModificateurCombi.Joueur, ModificateurCombi.HonneurCarre]), famille: Famille.Fleurs, number: 4});
    });
    it("should not be a combi of Fleurs because of the presence of two same piece", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("1", Famille.Fleurs)];
        expect(isHonneur(toTest, joueur)).toStrictEqual(undefined);
    });
    it("should not be a combi of Fleurs because of the presence of a saison", () => {
        const toTest = [new Piece("1", Famille.Fleurs), new Piece("2", Famille.Saison)];
        expect(isHonneur(toTest, joueur)).toStrictEqual(undefined);
    });
    it("should be a combi of saison with one honneur", () => {
        const toTest = [new Piece("1", Famille.Saison)];
        expect(isHonneur(toTest, joueur)).toStrictEqual({base: BaseCombi.Honneur, modificateur: new Set(), famille: Famille.Saison, number: 1});
    });
    it("sould not be a combi of saison because of the presence of 2 same piece", () => {
        const toTest = [new Piece("1", Famille.Saison), new Piece("1", Famille.Saison)];
        expect(isHonneur(toTest, joueur)).toStrictEqual(undefined);
    });
});