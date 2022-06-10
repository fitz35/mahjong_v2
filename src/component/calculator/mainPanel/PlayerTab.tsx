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
import { SearchParamsJoueur } from "../../../model/gameStateCalculator/GameSearchParamsCalculator";
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
    joueur: SearchParamsJoueur;
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
        utilitiesActu.removeCombinaison(combi);
        // if we remove the combi selected, we set it to undefined
        if (
            combiSelected !== undefined &&
            combi.playerIndex === combiSelected.playerIndex &&
            combi.combiIndex === combiSelected.combiIndex
        ) {
            setCombiSelected(undefined);
        }
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
        utilitiesActu.addCombinaison(
            new Combinaison([], exposeType),
            joueurIndex
        );
    };

    return (
        <Tabs type="card" centered>
            <TabPane
                tab={
                    <span>
                        <EyeOutlined />
                        visibles
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
                        cachées
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
                        honneurs
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