import { Divider, Tag } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import {
    Combinaison,
    CombinaisonExposeType,
} from "../../../model/dataModel/Combinaison";
import { CombiCalculated } from "../../../model/dataModel/dataUtils";
import {
    convertMancheStateToManche,
    Manche,
} from "../../../model/dataModel/Manche";
import { Piece } from "../../../model/dataModel/Piece";
import { MancheCalculatorState } from "../../../model/gameStateCalculator/MancheCalculatorState";
import {
    CombiScoringRule,
    MahjongScoringRule,
} from "../../../model/rules/interfacesScoringRules";
import {
    getCombiScoringRulesFromCombinaison,
    calculateMahjongScoringRules,
    CombiScore,
    calculateCombiScore,
    calculate,
    calculateBestMahjongScoring,
} from "../../../model/scores/calculateScore";
import { eliminateUndefined } from "../../../model/utils/setUtils";

interface MancheResultTabProps {
    mancheState: MancheCalculatorState;
    numberOfManche: number;
}

interface CombinaisonDataType {
    key: string;
    name: string;
    pieces: Piece[];
    visiblePoints: number;
    hiddenPoints: number;
    multPoints: number;
    combiType: CombinaisonExposeType;
}

interface MahjongDataType {
    key: string;
    name: string;
    flatPoints: number;
    multPoints: number;
    bestMahjong: boolean;
}

interface PlayerDataType {
    key: string;
    name: string;
    flatPoints: number;
    multPoints: number;
    pointBeforeRedis: number;
    pointAfterRedis: number;
    points: number;
    combinaisons: CombinaisonDataType[];
    mahjong: MahjongDataType[];
}

export function MancheResultTab({
    mancheState,
    numberOfManche,
}: MancheResultTabProps) {
    const [data, setData] = useState<PlayerDataType[] | undefined>(undefined);

    // compute data
    useEffect(() => {
        const mahjongPlayer: string | undefined = mancheState.mahjongPlayer;
        if (mahjongPlayer !== undefined) {
            const fetchData = async () => {
                const newManche: Manche | undefined =
                    convertMancheStateToManche(mancheState);
                if (newManche !== undefined) {
                    const data: PlayerDataType[] = [];

                    // for each player, get the data to display
                    for (let i = 0; i < 4; i++) {
                        const player = newManche.getPlayerByIndex(i);
                        // get the score
                        const combiScore = calculateCombiScore(
                            player.combinaisons
                        );
                        let mahjong: MahjongScoringRule[] = [];
                        let mahjongDataType: MahjongDataType[] = [];
                        // detect the mahjong
                        if (player.name === mahjongPlayer) {
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
                            if (newManche.mahjongUndected != undefined) {
                                mahjong.push(newManche.mahjongUndected);
                                mahjongDataType.push({
                                    key: newManche.mahjongUndected.name,
                                    name: newManche.mahjongUndected.name,
                                    flatPoints: newManche.mahjongUndected.open,
                                    multPoints:
                                        newManche.mahjongUndected.multiplicator,
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

                    setData(data);
                }
            };

            fetchData();
        }
    }, [mancheState]);

    // define the expended columns
    const expandedRowRender = (
        combinaisons: CombinaisonDataType[],
        mahjong: MahjongDataType[]
    ) => {
        const columnsCombi: ColumnsType<CombinaisonDataType> = [
            {
                title: "Nom",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Pieces",
                dataIndex: "pieces",
                key: "pieces",
                render: (pieces: Piece[]) => {
                    return (
                        <span>
                            {pieces.map((piece: Piece, index: number) => {
                                return (
                                    piece.getFrDisplayName() +
                                    (index < pieces.length - 1 ? ", " : " ")
                                );
                            })}
                        </span>
                    );
                },
            },
            {
                title: "Visible",
                dataIndex: "visiblePoints",
                key: "visiblePoints",
                render: (
                    visiblePoints: number,
                    record: CombinaisonDataType
                ) => {
                    return (
                        <div
                            className={
                                record.combiType ===
                                    CombinaisonExposeType.VISIBLE ||
                                record.combiType ===
                                    CombinaisonExposeType.HONNOR
                                    ? "historic-combinaison-type"
                                    : ""
                            }
                        >
                            {visiblePoints}
                        </div>
                    );
                },
            },
            {
                title: "Caché",
                dataIndex: "hiddenPoints",
                key: "hiddenPoints",
                render: (hiddenPoints: number, record: CombinaisonDataType) => {
                    return (
                        <div
                            className={
                                record.combiType ===
                                CombinaisonExposeType.HIDDEN
                                    ? "historic-combinaison-type"
                                    : ""
                            }
                        >
                            {hiddenPoints}
                        </div>
                    );
                },
            },
            {
                title: "Multiplication",
                dataIndex: "multPoints",
                key: "multPoints",
            },
        ];

        const columnsMahjong: ColumnsType<MahjongDataType> = [
            {
                title: "Nom",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Points",
                dataIndex: "flatPoints",
                key: "flatPoints",
            },
            {
                title: "Multiplicateur",
                dataIndex: "multPoints",
                key: "multPoints",
            },
            {
                title: "Le meilleur ?",
                dataIndex: "bestMahjong",
                key: "bestMahjong",
                render: (value: boolean) => {
                    return value ? (
                        <Tag color="green">oui</Tag>
                    ) : (
                        <Tag color="red">non</Tag>
                    );
                },
            },
        ];

        let mahjongTable: JSX.Element = <></>;
        if (mahjong.length > 0) {
            mahjongTable = (
                <Table
                    columns={columnsMahjong}
                    dataSource={mahjong}
                    pagination={false}
                ></Table>
            );
        }

        return (
            <div>
                <Table
                    columns={columnsCombi}
                    dataSource={combinaisons}
                    pagination={false}
                />
                {mahjongTable}
            </div>
        );
    };

    // define the columns

    const columns: ColumnsType<PlayerDataType> = [
        {
            title: "Nom",
            dataIndex: "name",
            key: "name",
        },
        Table.EXPAND_COLUMN,
        {
            title: "Points d'addition",
            dataIndex: "flatPoints",
            key: "flatPoints",
            sorter: (a, b) => a.flatPoints - b.flatPoints,
        },
        {
            title: "Points de multiplication",
            dataIndex: "multPoints",
            key: "multPoints",
            sorter: (a, b) => a.multPoints - b.multPoints,
        },
        {
            title: "Points avant redistribution",
            dataIndex: "pointBeforeRedis",
            key: "pointBeforeRedis",
            sorter: (a, b) => a.pointBeforeRedis - b.pointBeforeRedis,
        },
        {
            title: "Points après redistribution",
            dataIndex: "pointAfterRedis",
            key: "pointAfterRedis",
            sorter: (a, b) => a.pointAfterRedis - b.pointAfterRedis,
        },
        {
            title: "Points totaux",
            dataIndex: "points",
            key: "points",
            defaultSortOrder: "descend",
            sorter: (a, b) => a.points - b.points,
        },
    ];

    return (
        <>
            <Divider orientation="left">Manche {numberOfManche}</Divider>
            <Table
                columns={columns}
                expandable={{
                    expandedRowRender: (value: PlayerDataType) => {
                        return expandedRowRender(
                            value.combinaisons,
                            value.mahjong
                        );
                    },
                }}
                dataSource={data}
                pagination={false}
            />
        </>
    );
}
