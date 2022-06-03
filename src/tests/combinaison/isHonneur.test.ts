import { isHonneur } from "../../model/scores/combinaisonDetect";
import { Piece } from "../../model/dataModel/Piece";
import {
    BaseCombi,
    Famille,
    ModificateurCombi,
    NumeroVent,
} from "../../model/dataModel/dataUtils";

describe("Test the isHonneur algorithme", () => {
    const joueur: NumeroVent = NumeroVent.Nord;
    it("should be a combi of fleur with one honneur", () => {
        const toTest: Piece[] = [new Piece("1", Famille.Fleurs)];
        expect(isHonneur(toTest, joueur)).toStrictEqual([
            {
                base: BaseCombi.Honneur,
                modificateur: new Set(),
                famille: Famille.Fleurs,
            },
        ]);
    });
    it("should be a combi of Fleurs", () => {
        const toTest = [
            new Piece("1", Famille.Fleurs),
            new Piece("2", Famille.Fleurs),
        ];
        expect(isHonneur(toTest, joueur)).toStrictEqual([
            {
                base: BaseCombi.Honneur,
                modificateur: new Set(),
                famille: Famille.Fleurs,
            },
            {
                base: BaseCombi.Honneur,
                modificateur: new Set(),
                famille: Famille.Fleurs,
            },
        ]);
    });
    it("should be a combi of Saison", () => {
        const toTest = [
            new Piece("1", Famille.Saison),
            new Piece("2", Famille.Saison),
        ];
        expect(isHonneur(toTest, joueur)).toStrictEqual([{
            base: BaseCombi.Honneur,
            modificateur: new Set(),
            famille: Famille.Saison
        },
        {
            base: BaseCombi.Honneur,
            modificateur: new Set(),
            famille: Famille.Saison
        }]);
    });
    it("sould be a combi with 4 fleurs", () => {
        const toTest = [
            new Piece("1", Famille.Fleurs),
            new Piece("2", Famille.Fleurs),
            new Piece("3", Famille.Fleurs),
            new Piece("4", Famille.Fleurs),
        ];
        expect(isHonneur(toTest, joueur)).toStrictEqual([{
            base: BaseCombi.Honneur,
            modificateur: new Set([
                ModificateurCombi.Joueur,
                ModificateurCombi.HonneurCarre,
            ]),
            famille: Famille.Fleurs
        }]);
    });
    it("should not be a combi of Fleurs because of the presence of two same piece", () => {
        const toTest = [
            new Piece("1", Famille.Fleurs),
            new Piece("1", Famille.Fleurs),
        ];
        expect(isHonneur(toTest, joueur)).toStrictEqual([]);
    });
    it("should not be a combi of Fleurs because of the presence of a saison", () => {
        const toTest = [
            new Piece("1", Famille.Fleurs),
            new Piece("2", Famille.Saison),
        ];
        expect(isHonneur(toTest, joueur)).toStrictEqual([]);
    });
    it("should be a combi of saison with one honneur", () => {
        const toTest = [new Piece("1", Famille.Saison)];
        expect(isHonneur(toTest, joueur)).toStrictEqual([{
            base: BaseCombi.Honneur,
            modificateur: new Set(),
            famille: Famille.Saison
        }]);
    });
    it("sould not be a combi of saison because of the presence of 2 same piece", () => {
        const toTest = [
            new Piece("1", Famille.Saison),
            new Piece("1", Famille.Saison),
        ];
        expect(isHonneur(toTest, joueur)).toStrictEqual([]);
    });
});
