import { CopyOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";

export function SavePanel() {
    return (
        <Tooltip title="Copie dans le presse-papier l'url à réutiliser.">
            <Button
                type="primary"
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    message.success("Copié dans le presse-papier");
                }}
                icon={<CopyOutlined />}
            >
                Sauvegarder !
            </Button>
        </Tooltip>
    );
}
