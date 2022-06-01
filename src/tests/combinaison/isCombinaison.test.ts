import { getCombinaison } from "../../model/scores/combinaisonDetect";
import { Piece } from "../../model/dataModel/Piece";
import {
    BaseCombi,
    Famille,
    ModificateurCombi,
    NumeroVent,
} from "../../model/dataModel/dataUtils";
describe("Test the isCombinaison algorithme", () => {
    const joueur: NumeroVent = NumeroVent.Est;
    const dominant: NumeroVent = NumeroVent.Ouest;
    it("should be a combi of Fleurs", () => {
        const toTest = [
            new Piece("1", Famille.Fleurs),
            new Piece("2", Famille.Fleurs),
        ];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual({
            base: BaseCombi.Honneur,
            modificateur: new Set([ModificateurCombi.Joueur]),
            famille: Famille.Fleurs,
            number: 2,
        });
    });
    it("should be a combi of Saison", () => {
        const toTest = [
            new Piece("1", Famille.Saison),
            new Piece("2", Famille.Saison),
        ];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual({
            base: BaseCombi.Honneur,
            modificateur: new Set([ModificateurCombi.Joueur]),
            famille: Famille.Saison,
            number: 2,
        });
    });
    it("should be a carre of extrem of cercle", () => {
        const toTest = [
            new Piece("1", Famille.Cercle),
            new Piece("1", Famille.Cercle),
            new Piece("1", Famille.Cercle),
            new Piece("1", Famille.Cercle),
        ];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual({
            base: BaseCombi.Carre,
            modificateur: new Set([ModificateurCombi.ExtremNumero]),
            famille: Famille.Cercle,
        });
    });
    it("should be a carre of vent dominant", () => {
        const toTest = [
            new Piece("O", Famille.Vent),
            new Piece("O", Famille.Vent),
            new Piece("O", Famille.Vent),
            new Piece("O", Famille.Vent),
        ];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual({
            base: BaseCombi.Carre,
            modificateur: new Set([
                ModificateurCombi.VentOuDragon,
                ModificateurCombi.Dominant,
            ]),
            famille: Famille.Vent,
        });
    });
    it("should be a carre of vent of the joueur", () => {
        const toTest = [
            new Piece("E", Famille.Vent),
            new Piece("E", Famille.Vent),
            new Piece("E", Famille.Vent),
            new Piece("E", Famille.Vent),
        ];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual({
            base: BaseCombi.Carre,
            modificateur: new Set([
                ModificateurCombi.VentOuDragon,
                ModificateurCombi.Joueur,
            ]),
            famille: Famille.Vent,
        });
    });
    it("should be a suite of caractere", () => {
        const toTest = [
            new Piece("1", Famille.Caractere),
            new Piece("2", Famille.Caractere),
            new Piece("3", Famille.Caractere),
            new Piece("4", Famille.Caractere),
        ];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual({
            base: BaseCombi.Suite,
            modificateur: new Set(),
            famille: Famille.Caractere,
        });
    });
    it("shoudn't be a combi of Fleurs because of the presence of two same piece", () => {
        const toTest = [
            new Piece("1", Famille.Fleurs),
            new Piece("1", Famille.Fleurs),
        ];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual(
            undefined
        );
    });
    it("shouldn't be anything because the array is empty", () => {
        const toTest: Piece[] = [];
        expect(getCombinaison(toTest, joueur, dominant)).toStrictEqual(
            undefined
        );
    });
});
