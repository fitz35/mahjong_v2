import { CopyOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import { transformSearchParamsCalculatorToString } from "../../../model/gameState/GameSearchParamsCalculator";
import { GlobalCulatorState } from "../../../model/gameState/GlobalCalculatorState";

interface SavePanelProps {
    calculatorState: GlobalCulatorState;
}

export function SavePanel({ calculatorState }: SavePanelProps) {
    return (
        <Tooltip title="Copie dans le presse-papier l'url à réutiliser.">
            <Button
                type="primary"
                onClick={() => {
                    navigator.clipboard.writeText(
                        window.location.href +
                            "?" +
                            transformSearchParamsCalculatorToString(
                                calculatorState.gameState
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
