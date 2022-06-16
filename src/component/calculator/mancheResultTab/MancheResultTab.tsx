import Table, { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { Combinaison } from "../../../model/dataModel/Combinaison";
import { CombiCalculated } from "../../../model/dataModel/dataUtils";
import {
    convertMancheStateToManche,
    Manche,
} from "../../../model/dataModel/Manche";
import { Piece } from "../../../model/dataModel/Piece";
import { MancheCalculatorState } from "../../../model/gameStateCalculator/MancheCalculatorState";
import { CombiScoringRule } from "../../../model/rules/interfacesScoringRules";
import { getCombiScoringRulesFromCombinaison } from "../../../model/scores/calculateScore";
import { eliminateUndefined } from "../../../model/utils/setUtils";

interface MancheResultTabProps {
    mancheState: MancheCalculatorState;
}

interface ExpendedDataType {
    key: string;
    name: string;
    pieces: Piece[];
    visiblePoints: number;
    hiddenPoints: number;
    multPoints: number;
}

interface DataType {
    key: string;
    name: string;
    pointBeforeRedis: number;
    pointAfterRedis: number;
    combinaisons: ExpendedDataType[];
}

export function MancheResultTab({ mancheState }: MancheResultTabProps) {
    const [data, setData] = useState<DataType[] | undefined>(undefined);

    useEffect(() => {
        const mahjongPlayer: string | undefined = mancheState.mahjongPlayer;
        if (mahjongPlayer !== undefined) {
            const fetchData = async () => {
                const newManche: Manche | undefined =
                    convertMancheStateToManche(mancheState);
                if (newManche !== undefined) {
                    const data: DataType[] = [];

                    // for each player, get the data to display
                    for (let i = 0; i < 4; i++) {
                        const player = newManche.getPlayerByIndex(i);
                        const dataPlayer: DataType = {
                            key: player.name,
                            name: player.name,
                            pointBeforeRedis:
                                player.getScoreBeforeRedistribution(),
                            pointAfterRedis: player.getCurrentMancheScore(),
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
                                                    };
                                                } else {
                                                    return undefined;
                                                }
                                            }
                                        )
                                    );
                                }
                            ),
                        };
                        data.push(dataPlayer);
                    }

                    setData(data);
                }
            };

            fetchData();
        }
    }, [mancheState]);

    const expandedRowRender = (combinaisons: ExpendedDataType[]) => {
        const columns: ColumnsType<ExpendedDataType> = [
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
                            {pieces.map((piece: Piece) => {
                                return piece.getCode() + " ";
                            })}
                        </span>
                    );
                },
            },
            {
                title: "Visible",
                dataIndex: "visiblePoints",
                key: "visiblePoints",
            },
            {
                title: "Caché",
                dataIndex: "hiddenPoints",
                key: "hiddenPoints",
            },
            {
                title: "Multiplication",
                dataIndex: "multPoints",
                key: "multPoints",
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={combinaisons}
                pagination={false}
            />
            // TODO : add mahjong for the mahjong player
        );
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "Nom",
            dataIndex: "name",
            key: "name",
        },
        Table.EXPAND_COLUMN,
        {
            title: "Points avant redistribution",
            dataIndex: "pointBeforeRedis",
            key: "pointBeforeRedis",
        },
        {
            title: "Points après redistribution",
            dataIndex: "pointAfterRedis",
            key: "pointAfterRedis",
        },
    ];

    return (
        <Table
            columns={columns}
            expandable={{
                expandedRowRender: (value: DataType) => {
                    return expandedRowRender(value.combinaisons);
                },
            }}
            dataSource={data}
            pagination={false}
        />
    );
}
