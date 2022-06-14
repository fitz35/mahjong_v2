import { Card } from "antd";
import { Piece } from "../../../../model/dataModel/Piece";
import { UtilitiesActualType } from "../../../../model/gameStateCalculator/useCalculatorHistoricState";
import { AreaData } from "./MahjongPiecesImage";

interface TooltipProps {
    x: number;
    y: number;
    piece: Piece;
    utilitiesActu: UtilitiesActualType;
    areaData: AreaData;
}

export function Tooltip({
    x,
    y,
    piece,
    utilitiesActu,
    areaData,
}: TooltipProps) {
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
            style={{ top: y + 10, left: leftOffset }}
            className={
                utilitiesActu.getLastState().isPieceInGame(piece)
                    ? "tooltipNormal"
                    : "tooltipNoPiece"
            }
        >
            <span>
                {(utilitiesActu.getLastState().isPieceInGame(piece)
                    ? "Il reste " +
                      utilitiesActu.getLastState().getAmountOfPiece(piece) +
                      " "
                    : "Il ne reste plus de ") + "piece(s)"}
                .
            </span>
        </Card>
    );
}
