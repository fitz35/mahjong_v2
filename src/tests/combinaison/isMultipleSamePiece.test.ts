import {isMultipleSamePiece} from "../../model/pieces/Combinaison"
import { Piece } from "../../model/pieces/Piece";
import { BaseCombi, Famille, ModificateurCombi, NumeroVent } from "../../model/pieces/types";


describe('Test the isMultipleSamePiece algorithme', () => {
    it("Should be a pair", ()=> {
        const toTest = [new Piece("2", Famille.Cercle), new Piece("2", Famille.Cercle)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est)).toStrictEqual({base: BaseCombi.Paire, modificateur: new Set()});
    });

    it("Should be a pair of dragon", ()=> {
        const toTest = [new Piece("B", Famille.Dragon), new Piece("B", Famille.Dragon)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est)).toStrictEqual({base: BaseCombi.Paire, modificateur: new Set([ModificateurCombi.VentOuDragon])});
    });

    it("Should be a carre of vent dominant", ()=> {
        const toTest = [new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Ouest, NumeroVent.Est))
        .toStrictEqual({base: BaseCombi.Carre, modificateur: new Set([ModificateurCombi.VentOuDragon, ModificateurCombi.Dominant])});
    });

    it("Should be a brelan of vent dominant and joueur", ()=> {
        const toTest = [new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est))
        .toStrictEqual({base: BaseCombi.Carre, modificateur: new Set([ModificateurCombi.VentOuDragon, ModificateurCombi.Dominant, ModificateurCombi.Joueur])});
    });


    it("Should be not a brelan", ()=> {
        const toTest = [new Piece("O", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est))
        .toStrictEqual(undefined);
    });
});