import { Divider, Tag } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { CombinaisonExposeType } from "../../../model/dataModel/Combinaison";
import {
    convertMancheStateToManche,
    Manche,
} from "../../../model/dataModel/Manche";
import { Piece } from "../../../model/dataModel/Piece";
import { MancheCalculatorState } from "../../../model/gameStateCalculator/MancheCalculatorState";
import { convertMancheToDataDisplay } from "./ConvertMancheToDataDisplay";

interface MancheResultTabProps {
    mancheState: MancheCalculatorState;
    numberOfManche: number;
}

export interface CombinaisonDataType {
    key: string;
    name: string;
    pieces: Piece[];
    visiblePoints: number;
    hiddenPoints: number;
    multPoints: number;
    combiType: CombinaisonExposeType;
}

export interface MahjongDataType {
    key: string;
    name: string;
    flatPoints: number;
    multPoints: number;
    bestMahjong: boolean;
}

export interface PlayerDataType {
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
                    setData(convertMancheToDataDisplay(newManche));
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
