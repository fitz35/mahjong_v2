import { Piece } from "../../../../model/dataModel/Piece";
import { AreaData } from "./MahjongPiecesImage";

interface MahjongPieceAreaProps {
    x: number;
    y: number;
    piece: Piece;
    areaData: AreaData;
    onMouseEnter: (x: number, y: number, piece: Piece) => void;
    onMouseLeave: (x: number, y: number, piece: Piece) => void;
    onClick: (x: number, y: number, piece: Piece) => void;
}

/**
 * make an area for a piece at the specified location
 * @param param0
 * @returns
 */
export function MahjongPieceArea({
    x,
    y,
    piece,
    areaData,
    onMouseEnter,
    onMouseLeave,
    onClick,
}: MahjongPieceAreaProps): JSX.Element {
    const coord =
        x + "," + y + "," + (x + areaData.width) + "," + (y + areaData.height);

    return (
        <area
            key={"area_" + piece.getFrDisplayName()}
            shape="rect"
            coords={coord}
            alt={piece.getFrDisplayName()}
            title={piece.getFrDisplayName()}
            onMouseEnter={() => onMouseEnter(x, y, piece)}
            onMouseLeave={() => onMouseLeave(x, y, piece)}
            onClick={() => onClick(x, y, piece)}
        ></area>
    );
}
