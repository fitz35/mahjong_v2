import { Combinaison } from "../../../model/dataModel/Combinaison";
import { CombiCalculated } from "../../../model/dataModel/dataUtils";
import { Manche } from "../../../model/dataModel/Manche";
import { MahjongScoringRule, CombiScoringRule } from "../../../model/rules/interfacesScoringRules";
import { calculateCombiScore, calculateMahjongScoringRules, calculateBestMahjongScoring, CombiScore, calculate, getCombiScoringRulesFromCombinaison } from "../../../model/scores/calculateScore";
import { eliminateUndefined } from "../../../model/utils/setUtils";
import { MahjongDataType, PlayerDataType } from "./MancheResultTab";

export function convertMancheToDataDisplay(manche: Manche): PlayerDataType[] {
    const data: PlayerDataType[] = [];

    // for each player, get the data to display
    for (let i = 0; i < 4; i++) {
        const player = manche.getPlayerByIndex(i);
        // get the score
        const combiScore = calculateCombiScore(
            player.combinaisons
        );
        let mahjong: MahjongScoringRule[] = [];
        let mahjongDataType: MahjongDataType[] = [];
        // detect the mahjong
        if (player.name === manche.mahjongName) {
            mahjong = calculateMahjongScoringRules(
                player.combinaisons
            );
            mahjongDataType = mahjong.map((value) => {
                return {
                    key: value.name,
                    name: value.name,
                    flatPoints: value.open,
                    multPoints: value.multiplicator,
                    bestMahjong: false,
                };
            });
            if (manche.mahjongUndected != undefined) {
                mahjong.push(manche.mahjongUndected);
                mahjongDataType.push({
                    key: manche.mahjongUndected.name,
                    name: manche.mahjongUndected.name,
                    flatPoints: manche.mahjongUndected.open,
                    multPoints:
                        manche.mahjongUndected.multiplicator,
                    bestMahjong: false,
                });
            }
        }

        // get the best mahjong
        const bestMahjong = calculateBestMahjongScoring(
            combiScore,
            mahjong
        );
        if (bestMahjong !== undefined) {
            mahjongDataType = mahjongDataType.map((value) => {
                if (value.name === bestMahjong.name) {
                    return {
                        ...value,
                        bestMahjong: true,
                    };
                }
                return value;
            });
        }

        // get the best score
        const combiAndMahjongScore: CombiScore = calculate(
            [combiScore],
            eliminateUndefined([bestMahjong])
        );

        const dataPlayer: PlayerDataType = {
            key: player.name,
            name: player.name,
            flatPoints: combiAndMahjongScore.addition,
            multPoints: combiAndMahjongScore.multiplicateur,
            pointBeforeRedis:
                player.getScoreBeforeRedistribution(),
            pointAfterRedis: player.getCurrentMancheScore(),
            points:
                player.scores + player.getCurrentMancheScore(),
            // get the data for each combinaison
            combinaisons: player.combinaisons.flatMap(
                (combi: Combinaison, indexPlayer: number) => {
                    // convert combi into a CombiCalculated
                    return eliminateUndefined(
                        combi.combiCalculated.map(
                            (
                                combiCalculated: CombiCalculated,
                                index: number
                            ) => {
                                // convert a combiCalculated into a CombiScore to have the score
                                const combiScoring:
                                    | CombiScoringRule
                                    | undefined =
                                    getCombiScoringRulesFromCombinaison(
                                        combiCalculated
                                    );
                                if (
                                    combiScoring !== undefined
                                ) {
                                    return {
                                        key:
                                            indexPlayer.toString() +
                                            " " +
                                            index.toString(),
                                        name: combiScoring.name,
                                        pieces: combi.pieces,
                                        visiblePoints:
                                            combiScoring.open,
                                        hiddenPoints:
                                            combiScoring.hidden,
                                        multPoints:
                                            combiScoring.multiplicator,
                                        combiType:
                                            combi.exposeType,
                                    };
                                } else {
                                    return undefined;
                                }
                            }
                        )
                    );
                }
            ),
            mahjong: mahjongDataType,
        };
        data.push(dataPlayer);
    }
    return data;
}