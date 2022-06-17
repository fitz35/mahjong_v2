import { Button, Card, Col, List, Row, Tabs } from "antd";
import { useState } from "react";
import { Famille, NumeroVent } from "../../../model/dataModel/dataUtils";
import { Piece } from "../../../model/dataModel/Piece";
import {
    MancheCalculatorState,
    JoueurCalculatorState,
} from "../../../model/gameStateCalculator/MancheCalculatorState";
import {
    CombiSelected,
    UtilitiesActualType,
    UtilitiesHistoryType,
} from "../../../model/gameStateCalculator/useCalculatorHistoricState";
import { getJoueurGenerator } from "../../../model/utils/joueursUtils";
import { MahjongDrawer } from "../mahjongDrawer/MahjongDrawer";
import { MahjongPiecesImage } from "./mahjongPiecesImage/MahjongPiecesImage";
import { PlayerTab } from "./PlayerTab";

const { TabPane } = Tabs;

const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

interface MainsPanelProps {
    utilitiesActu: UtilitiesActualType;
    utilitiesHistory: UtilitiesHistoryType;
}

interface PlayerDataList {
    name: string;
    score: number;
    vent: NumeroVent;
}

export function MainsPanel({
    utilitiesActu,
    utilitiesHistory,
}: MainsPanelProps) {
    const [combiSelected, setCombiSelected] = useState<
        CombiSelected | undefined
    >(undefined);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerManche, setDrawerManche] = useState(0);

    // generation of the panel for every joueur
    const panes: JSX.Element[] = [];
    const data: PlayerDataList[] = [];
    const joueurGen = getJoueurGenerator<
        JoueurCalculatorState,
        MancheCalculatorState
    >(utilitiesActu.getLastState().gameState);
    for (const [joueur, i] of joueurGen) {
        panes.push(
            <TabPane
                tab={joueur.name + " (" + joueur.main.length + ")"}
                key={"mainPanelForJoueur" + i}
            >
                <PlayerTab
                    combiSelected={combiSelected}
                    setCombiSelected={setCombiSelected}
                    joueurIndex={i}
                    joueur={joueur}
                    utilitiesActu={utilitiesActu}
                ></PlayerTab>
            </TabPane>
        );
        data.push({
            name: joueur.name,
            score: joueur.points,
            vent: joueur.vent,
        });
    }
    data.sort((a, b) => b.score - a.score);

    return (
        <>
            <Row>
                <Col span={24}>
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={data}
                        renderItem={(item, index) => (
                            <List.Item>
                                <Card
                                    title={
                                        index +
                                        1 +
                                        (index === 0 ? "er " : "ème ") +
                                        "joueur : " +
                                        item.name +
                                        " (" +
                                        new Piece(
                                            item.vent,
                                            Famille.Vent
                                        ).getFrDisplayName() +
                                        ")"
                                    }
                                >
                                    {item.score + " points"}
                                </Card>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
            <Row gutter={gutter}>
                <Col className="gutter-row" span={9}>
                    <MahjongPiecesImage
                        combiSelected={combiSelected}
                        utilitiesActu={utilitiesActu}
                    ></MahjongPiecesImage>
                </Col>
                <Col className="gutter-row" span={15}>
                    <Tabs
                        centered
                        style={{ height: "100%" }}
                        onChange={() => {
                            setCombiSelected(undefined);
                        }}
                        tabBarExtraContent={
                            <Button
                                onClick={() => {
                                    setDrawerVisible(true);
                                    setDrawerManche(
                                        utilitiesHistory.getHistoricLength() - 1
                                    );
                                }}
                            >
                                Valider le mahjong
                            </Button>
                        }
                    >
                        {panes}
                    </Tabs>
                    <MahjongDrawer
                        utilitiesActu={utilitiesActu}
                        utilitiesHistory={utilitiesHistory}
                        mancheIndex={drawerManche}
                        visible={drawerVisible}
                        onClose={() => setDrawerVisible(false)}
                    ></MahjongDrawer>
                </Col>
            </Row>
        </>
    );
}
