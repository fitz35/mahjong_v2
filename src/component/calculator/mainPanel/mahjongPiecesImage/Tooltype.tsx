import { Card } from "antd";
import { Piece } from "../../../../model/dataModel/Piece";
import { AreaData } from "./MahjongPiecesImage";

interface TooltipProps {
    x: number;
    y: number;
    piece: Piece;
    areaData: AreaData;
}

export function Tooltip({ x, y, piece, areaData }: TooltipProps) {
    const tooltipWidth = 250;
    let leftOffset = 0;
    //on test si elle n'est pas sortie de l'ecran :
    const largeur_fenetre = window.innerWidth;
    if (tooltipWidth + areaData.width + x > largeur_fenetre) {
        leftOffset = x - tooltipWidth - 20;
    } else {
        leftOffset = x + areaData.width + 20;
    }

    return (
        <Card
            id="tooltip"
            size="small"
            title={piece.getFrDisplayName()}
            className="bg-green-100"
            style={{ top: y + 10, left: leftOffset }}
        >
            <span>test</span>
        </Card>
    );
}
