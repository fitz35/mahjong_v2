import {
    EyeInvisibleOutlined,
    EyeOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons";
import { Button, Tabs } from "antd";
import {
    Combinaison,
    CombinaisonExposeType,
} from "../../../model/dataModel/Combinaison";
import { JoueurCalculatorState } from "../../../model/gameStateCalculator/MancheCalculatorState";
import {
    CombiSelected,
    UtilitiesActualType,
} from "../../../model/gameStateCalculator/useCalculatorHistoricState";
import { CombinaisonDisplay } from "./CombinaisonDisplay";

const { TabPane } = Tabs;

interface PlayerTabProps {
    /**
     * the combi selected
     */
    combiSelected: CombiSelected | undefined;
    /**
     * set the combi selected
     */
    setCombiSelected: React.Dispatch<
        React.SetStateAction<CombiSelected | undefined>
    >;

    joueurIndex: number;
    joueur: JoueurCalculatorState;
    utilitiesActu: UtilitiesActualType;
}

/**
 * dispplay the main panel for a player
 * @param param0 the player
 * @returns
 */
export function PlayerTab({
    combiSelected,
    setCombiSelected,
    joueurIndex,
    joueur,
    utilitiesActu,
}: PlayerTabProps) {
    const onCombiRemove = (combi: CombiSelected) => {
        // if we remove the combi selected, we set it to undefined
        if (
            combiSelected !== undefined &&
            combi.playerIndex === combiSelected.playerIndex &&
            combi.combiIndex === combiSelected.combiIndex
        ) {
            setCombiSelected(undefined);
        } // if the combi selected is a same player combi to remove, we set it to minus 1 if it i more than 0
        else if (
            combiSelected !== undefined &&
            combi.playerIndex === combiSelected.playerIndex &&
            combiSelected.combiIndex > 0
        ) {
            setCombiSelected({
                combiIndex: combiSelected.combiIndex - 1,
                playerIndex: combiSelected.playerIndex,
            });
        }

        utilitiesActu.removeCombinaison(combi);
    };

    const visibleCombi: JSX.Element[] = [];
    const hiddenCombi: JSX.Element[] = [];
    const honnorCombi: JSX.Element[] = [];
    // sort the combi by type
    for (let i = 0; i < joueur.main.length; i++) {
        const combi = joueur.main[i];

        if (combi.exposeType === CombinaisonExposeType.VISIBLE) {
            visibleCombi.push(
                <div key={i}>
                    <CombinaisonDisplay
                        isSelected={
                            combiSelected !== undefined &&
                            combiSelected.combiIndex === i &&
                            combiSelected.playerIndex === joueurIndex
                        }
                        setCombiSelected={setCombiSelected}
                        joueurIndex={joueurIndex}
                        combinaisonIndex={i}
                        onCombiRemove={onCombiRemove}
                        onPieceClick={utilitiesActu.removePieceInCombinaison}
                        combinaison={combi}
                    ></CombinaisonDisplay>
                </div>
            );
        } else if (combi.exposeType === CombinaisonExposeType.HONNOR) {
            honnorCombi.push(
                <div key={i}>
                    <CombinaisonDisplay
                        isSelected={
                            combiSelected !== undefined &&
                            combiSelected.combiIndex === i &&
                            combiSelected.playerIndex === joueurIndex
                        }
                        setCombiSelected={setCombiSelected}
                        joueurIndex={joueurIndex}
                        combinaisonIndex={i}
                        onCombiRemove={onCombiRemove}
                        onPieceClick={utilitiesActu.removePieceInCombinaison}
                        combinaison={combi}
                    ></CombinaisonDisplay>
                </div>
            );
        } else {
            hiddenCombi.push(
                <div key={i}>
                    <CombinaisonDisplay
                        isSelected={
                            combiSelected !== undefined &&
                            combiSelected.combiIndex === i &&
                            combiSelected.playerIndex === joueurIndex
                        }
                        setCombiSelected={setCombiSelected}
                        joueurIndex={joueurIndex}
                        combinaisonIndex={i}
                        onCombiRemove={onCombiRemove}
                        onPieceClick={utilitiesActu.removePieceInCombinaison}
                        combinaison={combi}
                    ></CombinaisonDisplay>
                </div>
            );
        }
    }

    // if we had a combi :
    const onCombiAdd = (exposeType: CombinaisonExposeType) => {
        setCombiSelected({
            combiIndex: joueur.main.length,
            playerIndex: joueurIndex,
        });
        utilitiesActu.addCombinaison(
            new Combinaison(
                [],
                joueur.vent,
                utilitiesActu.getLastState().gameState.dominantVent,
                exposeType
            ),
            joueurIndex
        );
    };

    return (
        <Tabs
            type="card"
            centered
            onChange={() => {
                setCombiSelected(undefined);
            }}
        >
            <TabPane
                tab={
                    <span>
                        <EyeOutlined />
                        visibles ({visibleCombi.length})
                    </span>
                }
                key="visible"
            >
                {visibleCombi}
                <div style={{ textAlign: "center" }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            onCombiAdd(CombinaisonExposeType.VISIBLE);
                        }}
                    >
                        Ajouter une combinaison
                    </Button>
                </div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <EyeInvisibleOutlined />
                        cachées ({hiddenCombi.length})
                    </span>
                }
                key="cache"
            >
                {hiddenCombi}
                <div style={{ textAlign: "center" }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            onCombiAdd(CombinaisonExposeType.HIDDEN);
                        }}
                    >
                        Ajouter une combinaison
                    </Button>
                </div>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <PlusSquareOutlined />
                        honneurs ({honnorCombi.length})
                    </span>
                }
                key="honneur"
            >
                {honnorCombi}
                <div style={{ textAlign: "center" }}>
                    <Button
                        type="primary"
                        onClick={() => {
                            onCombiAdd(CombinaisonExposeType.HONNOR);
                        }}
                    >
                        Ajouter une combinaison
                    </Button>
                </div>
            </TabPane>
        </Tabs>
    );
}
