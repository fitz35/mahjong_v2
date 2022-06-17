import "reflect-metadata";
import { Combinaison, CombinaisonExposeType } from "../../model/dataModel/Combinaison";
import { NumeroVent } from "../../model/dataModel/dataUtils";
import { Joueur } from "../../model/dataModel/Joueur";
import { Manche } from "../../model/dataModel/Manche";
import { Piece } from "../../model/dataModel/Piece";

describe("test the redistribution", () => {
    it("first simple test : 4 player with a mahjong normal for the est player", () => {
        const player1: Joueur = new Joueur(
            [
                new Combinaison([
                    new Piece("2R"),
                    new Piece("2R"),
                    new Piece("2R"),
                ],
                NumeroVent.Est,
                NumeroVent.Nord
                ),
                new Combinaison([
                    new Piece("1C"),
                    new Piece("2C"),
                    new Piece("3C"),
                ],
                NumeroVent.Est,
                NumeroVent.Nord),
            ],
            NumeroVent.Est,
            "Titouan",
            0
        );

        const player2: Joueur = new Joueur(
            [
                new Combinaison([
                    new Piece("2R"),
                    new Piece("2R"),
                    new Piece("2R"),
                ],
                NumeroVent.Sud,
                NumeroVent.Nord
                ),
                new Combinaison([
                    new Piece("2C"),
                    new Piece("2C"),
                    new Piece("2C"),
                ],
                NumeroVent.Sud,
                NumeroVent.Nord
                ),
            ],
            NumeroVent.Sud,
            "Tushita",
            0
        );

        const player3: Joueur = new Joueur(
            [
                new Combinaison([
                    new Piece("2R"),
                    new Piece("2R"),
                    new Piece("2R"),
                ],
                NumeroVent.Ouest,
                NumeroVent.Nord
                ),
                new Combinaison([
                    new Piece("1C"),
                    new Piece("1C"),
                    new Piece("1C"),
                ],
                NumeroVent.Ouest,
                NumeroVent.Nord
                ),
                new Combinaison([
                    new Piece("1B"),
                    new Piece("1B"),
                    new Piece("1B"),
                ],
                NumeroVent.Ouest,
                NumeroVent.Nord
                ),
            ],
            NumeroVent.Ouest,
            "Clement",
            0
        );

        const player4: Joueur = new Joueur([], NumeroVent.Nord, "Dorian", 0);

        new Manche(
            NumeroVent.Nord,
            "Titouan",
            player1,
            player2,
            player3,
            player4
        );

        expect(player1.getScoreBeforeRedistribution()).toBe(22);
        expect(player2.getScoreBeforeRedistribution()).toBe(4);
        expect(player3.getScoreBeforeRedistribution()).toBe(10);
        expect(player4.getScoreBeforeRedistribution()).toBe(0);

        expect(player1.getCurrentMancheScore()).toBe(132);
        expect(player2.getCurrentMancheScore()).toBe(-46);
        expect(player3.getCurrentMancheScore()).toBe(-28);
        expect(player4.getCurrentMancheScore()).toBe(-58);
    });

    it("second simple test : 4 player with a mahjong normal for the ouest player", () => {
        const player1: Joueur = new Joueur(
            [
                new Combinaison([
                    new Piece("2R"),
                    new Piece("2R"),
                    new Piece("2R"),
                ],
                NumeroVent.Est,
                NumeroVent.Nord)
            ],
            NumeroVent.Est,
            "Titouan",
            0
        );

        const player2: Joueur = new Joueur(
            [
                new Combinaison([
                    new Piece("1R"),
                    new Piece("2R"),
                    new Piece("3R"),
                ],
                NumeroVent.Ouest,
                NumeroVent.Nord
                ),
                new Combinaison([
                    new Piece("1C"),
                    new Piece("2C"),
                    new Piece("3C"),
                ],
                NumeroVent.Ouest,
                NumeroVent.Nord
                ),
                new Combinaison([
                    new Piece("OV"),
                    new Piece("OV"),
                    new Piece("OV"),
                ],
                NumeroVent.Ouest,
                NumeroVent.Nord
                ),
            ],
            NumeroVent.Ouest,
            "Clement",
            0
        );
        const player3: Joueur = new Joueur(
            [
                new Combinaison([
                    new Piece("2R"),
                    new Piece("2R"),
                    new Piece("2R"),
                ],
                NumeroVent.Sud, 
                NumeroVent.Nord, 
                CombinaisonExposeType.HIDDEN
                ),
                new Combinaison([
                    new Piece("2F")
                ],
                NumeroVent.Sud, 
                NumeroVent.Nord
                ),
            ],
            NumeroVent.Sud,
            "Tushita",
            0
        );
        const player4: Joueur = new Joueur([], NumeroVent.Nord, "Dorian", 0);

        new Manche(
            NumeroVent.Nord,
            "Clement",
            player1,
            player2,
            player3,
            player4
        );

        expect(player1.getScoreBeforeRedistribution()).toBe(2);
        expect(player2.getScoreBeforeRedistribution()).toBe(96);
        expect(player3.getScoreBeforeRedistribution()).toBe(16);
        expect(player4.getScoreBeforeRedistribution()).toBe(0);

        expect(player1.getCurrentMancheScore()).toBe(-216);
        expect(player2.getCurrentMancheScore()).toBe(384);
        expect(player3.getCurrentMancheScore()).toBe(-52);
        expect(player4.getCurrentMancheScore()).toBe(-116);
    });
});
