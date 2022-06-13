import { CopyOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import { UtilitiesHistoryType } from "../../../model/gameStateCalculator/useCalculatorHistoricState";

interface SavePanelProps {
    utilitiesHisto: UtilitiesHistoryType;
}

export function SavePanel({ utilitiesHisto }: SavePanelProps) {
    return (
        <Tooltip title="Copie dans le presse-papier l'url à réutiliser.">
            <Button
                type="primary"
                onClick={() => {
                    navigator.clipboard.writeText(
                        window.location.href +
                            "?" +
                            utilitiesHisto.getAsSearchParams()
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
