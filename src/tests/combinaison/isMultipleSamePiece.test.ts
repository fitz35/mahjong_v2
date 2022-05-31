import {isMultipleSamePiece} from "../../model/scores/combinaisonDetect"
import { Piece } from "../../model/dataModel/Piece";
import { BaseCombi, Famille, ModificateurCombi, NumeroVent } from "../../model/dataModel/dataUtils";


describe('Test the isMultipleSamePiece algorithme', () => {
    it("Should be a pair", ()=> {
        const toTest = [new Piece("2", Famille.Cercle), new Piece("2", Famille.Cercle)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est)).toStrictEqual({base: BaseCombi.Paire, modificateur: new Set(), famille : Famille.Cercle});
    });

    it("Should be a pair of dragon", ()=> {
        const toTest = [new Piece("B", Famille.Dragon), new Piece("B", Famille.Dragon)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est)).toStrictEqual({base: BaseCombi.Paire, modificateur: new Set([ModificateurCombi.VentOuDragon]), famille: Famille.Dragon});
    });

    it("Should be a carre of vent dominant", ()=> {
        const toTest = [new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Ouest, NumeroVent.Est))
        .toStrictEqual({base: BaseCombi.Carre, modificateur: new Set([ModificateurCombi.VentOuDragon, ModificateurCombi.Dominant]), famille: Famille.Vent});
    });

    it("Should be a brelan of vent dominant and joueur", ()=> {
        const toTest = [new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est))
        .toStrictEqual({base: BaseCombi.Carre, modificateur: new Set([ModificateurCombi.VentOuDragon, ModificateurCombi.Dominant, ModificateurCombi.Joueur]), famille: Famille.Vent});
    });


    it("Should be not a brelan", ()=> {
        const toTest = [new Piece("O", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent), new Piece("E", Famille.Vent)];
        expect(isMultipleSamePiece(toTest, NumeroVent.Est, NumeroVent.Est))
        .toStrictEqual(undefined);
    });
});