import { CopyOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import { transformSearchParamsCalculatorToString } from "../../../model/gameStateCalculator/MancheCalculatorState";
import { UtilitiesActualType } from "../../../model/gameStateCalculator/useCalculatorHistoricState";

interface SavePanelProps {
    utilitiesActu: UtilitiesActualType;
}

export function SavePanel({ utilitiesActu }: SavePanelProps) {
    return (
        <Tooltip title="Copie dans le presse-papier l'url à réutiliser.">
            <Button
                type="primary"
                onClick={() => {
                    navigator.clipboard.writeText(
                        window.location.href +
                            "?" +
                            transformSearchParamsCalculatorToString(
                                utilitiesActu.getLastState().gameState
                            )
                    );
                    message.success("Copié dans le presse-papier");
                }}
                icon={<CopyOutlined />}
            >
                Sauvegarder !
            </Button>
        </Tooltip>
    );
}
