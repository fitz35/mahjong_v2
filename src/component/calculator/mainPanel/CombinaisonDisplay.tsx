import { CloseCircleTwoTone } from "@ant-design/icons";
import { Button, Col, List, Row, Tooltip } from "antd";
import { Combinaison } from "../../../model/dataModel/Combinaison";
import { Piece } from "../../../model/dataModel/Piece";
import { CombiSelected } from "../../../model/gameStateCalculator/useCalculatorHistoricState";

interface CombinaisonDisplayProps {
    /**
     * if the combi is selected
     */
    isSelected: boolean;
    /**
     * if this combi is clicked, set the combi at this combi
     */
    setCombiSelected: React.Dispatch<
        React.SetStateAction<CombiSelected | undefined>
    >;

    joueurIndex: number;
    combinaisonIndex: number;
    combinaison: Combinaison;

    onCombiRemove: (combi: CombiSelected) => void;
    onPieceClick: (pieceIndex: number, combi: CombiSelected) => void;
}

/**
 * display a combinaison
 * @returns
 */
export function CombinaisonDisplay({
    isSelected,
    setCombiSelected,
    joueurIndex,
    combinaisonIndex,
    combinaison,
    onCombiRemove,
    onPieceClick,
}: CombinaisonDisplayProps) {
    let combiClassName = "combinaison";
    if (isSelected) {
        combiClassName += " combinaison-selected";
    }
    if (!combinaison.isValid()) {
        combiClassName += " combinaison-invalid";
    }

    return (
        <Row className={combiClassName}>
            <Col
                span={23}
                onClick={() => {
                    setCombiSelected({
                        combiIndex: combinaisonIndex,
                        playerIndex: joueurIndex,
                    });
                }}
            >
                <List
                    grid={{ gutter: 16, column: 16 }}
                    dataSource={combinaison.pieces}
                    renderItem={(item: Piece, pieceIndex: number) => (
                        <List.Item>
                            <Tooltip
                                placement="bottom"
                                title={item.getFrDisplayName()}
                            >
                                <img
                                    onClick={() => {
                                        onPieceClick(pieceIndex, {
                                            combiIndex: combinaisonIndex,
                                            playerIndex: joueurIndex,
                                        });
                                    }}
                                    alt={item.getCode()}
                                    src={item.getImageUrl()}
                                ></img>
                            </Tooltip>
                        </List.Item>
                    )}
                />
            </Col>
            <Col span={1}>
                <Button
                    onClick={() =>
                        onCombiRemove({
                            playerIndex: joueurIndex,
                            combiIndex: combinaisonIndex,
                        })
                    }
                    style={{ backgroundColor: "#cc0000" }}
                >
                    <CloseCircleTwoTone twoToneColor="#cc0000" />
                </Button>
            </Col>
        </Row>
    );
}
