import { Col, Row, Tabs } from "antd";
import { useState } from "react";
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
import { MahjongPiecesImage } from "./mahjongPiecesImage/MahjongPiecesImage";
import { PlayerTab } from "./PlayerTab";

const { TabPane } = Tabs;

const gutter = { xs: 8, sm: 16, md: 24, lg: 32 };

interface MainsPanelProps {
    utilitiesActu: UtilitiesActualType;
    utilitiesHistory: UtilitiesHistoryType;
}

export function MainsPanel({ utilitiesActu }: MainsPanelProps) {
    const [combiSelected, setCombiSelected] = useState<
        CombiSelected | undefined
    >(undefined);
    // generation of the panel for every joueur
    const panes: JSX.Element[] = [];
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
    }

    return (
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
                >
                    {panes}
                </Tabs>
            </Col>
        </Row>
    );
}
