import { useEffect, useRef, useState } from "react";
import { Piece } from "../../../../model/dataModel/Piece";
import { Famille } from "../../../../model/dataModel/dataUtils";
import {
    CombiSelected,
    UtilitiesActualType,
} from "../../../../model/gameStateCalculator/useCalculatorHistoricState";
import { MahjongPieceArea } from "./MahjongPieceArea";
import { Tooltip } from "./Tooltype";
import { message } from "antd";

//////////////////////////////////////////////
// info to build area

export type AreaData = {
    imgWidth: number;
    imgHeight: number;
    x_init: number;
    y_init: number;
    width: number;
    height: number;
    espace_w: number;
    espace_h: number;
};

const defaultAreaData: AreaData = {
    imgWidth: 700,
    imgHeight: 613,
    x_init: 128,
    y_init: 60,
    width: 58,
    height: 74,
    espace_w: 1,
    espace_h: 6,
};

/**
 * get the new area data with new height and width
 * @param imgWidth the actuel width of the image
 * @param imgHeight the actuel height of the image
 * @returns the new area data
 */
function getNewAreaData(imgWidth: number, imgHeight: number): AreaData {
    const newAreaData: AreaData = {
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        x_init: Math.ceil(
            (defaultAreaData.x_init * imgWidth) / defaultAreaData.imgWidth
        ),
        y_init: Math.ceil(
            (defaultAreaData.y_init * imgHeight) / defaultAreaData.imgHeight
        ),
        width: Math.ceil(
            (defaultAreaData.width * imgWidth) / defaultAreaData.imgWidth
        ),
        height: Math.ceil(
            (defaultAreaData.height * imgHeight) / defaultAreaData.imgHeight
        ),
        espace_w: Math.ceil(
            (defaultAreaData.espace_w * imgWidth) / defaultAreaData.imgWidth
        ),
        espace_h: Math.ceil(
            (defaultAreaData.espace_h * imgHeight) / defaultAreaData.imgHeight
        ),
    };
    return newAreaData;
}

/////////////////////////////////////////////////////////::
// state

export type TooltypeState =
    | {
          x: number;
          y: number;
          piece: Piece;
      }
    | undefined;

type ImageState = {
    areaData: AreaData;
};

////////////////////////////////////////

/**
 * generation of the area for the pieces
 * @param imgWidth the actuel width of the image
 * @param imgHeight the actuel height of the image
 * @param setTooltipInfo the function to set the tooltip info
 * @returns the area for the pieces
 */
function generationArea(
    areaData: AreaData,
    utilitiesActu: UtilitiesActualType,
    combiSelected: CombiSelected | undefined,
    setTooltipInfo: React.Dispatch<React.SetStateAction<TooltypeState>>
): JSX.Element[] {
    let xCursor = areaData.x_init;
    let yCursor = areaData.y_init;

    // generation of the map to manage the clique and the hover
    const areaBuffer: Array<JSX.Element> = [];

    const onMouseEnter = (x_in: number, y_in: number, piece: Piece) => {
        setTooltipInfo({
            x: x_in,
            y: y_in,
            piece: piece,
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onMouseLeave = (x_in: number, y_in: number, piece: Piece) => {
        setTooltipInfo(undefined);
    };

    const onAreaClick = (x_in: number, y_in: number, piece: Piece) => {
        if (utilitiesActu.getLastState().isPieceInGame(piece)) {
            if (combiSelected) {
                utilitiesActu.addPieceInCombinaison(piece, combiSelected);
            } else {
                message.error("Veuillez selectionner une combinaison");
            }
        } else {
            message.error("Cette pièce n'est plus dans la partie");
        }
    };

    //3 bases famille
    const baseFamilles = [Famille.Caractere, Famille.Cercle, Famille.Bambou];
    for (
        let baseFamille = 0;
        baseFamille < baseFamilles.length;
        baseFamille++
    ) {
        for (let numero = 1; numero <= 9; numero++) {
            areaBuffer.push(
                <MahjongPieceArea
                    key={`${baseFamilles[baseFamille]}${numero}`}
                    x={xCursor}
                    y={yCursor}
                    piece={
                        new Piece(numero.toString(), baseFamilles[baseFamille])
                    }
                    areaData={areaData}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={onAreaClick}
                ></MahjongPieceArea>
            );
            xCursor += areaData.width + areaData.espace_w;
        }
        xCursor = areaData.x_init;
        yCursor += areaData.height + areaData.espace_h;
    }
    // vent
    const ventNumeros = ["E", "S", "O", "N"];
    for (let vent = 0; vent < ventNumeros.length; vent++) {
        areaBuffer.push(
            <MahjongPieceArea
                key={`vent${vent}`}
                x={xCursor}
                y={yCursor}
                piece={new Piece(ventNumeros[vent], Famille.Vent)}
                areaData={areaData}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onAreaClick}
            ></MahjongPieceArea>
        );
        xCursor += areaData.width + areaData.espace_w;
    }
    xCursor = areaData.x_init;
    yCursor += areaData.height + areaData.espace_h;
    const dragonNumero = ["R", "V", "B"];
    for (let dragon = 0; dragon < dragonNumero.length; dragon++) {
        areaBuffer.push(
            <MahjongPieceArea
                key={`dragon${dragon}`}
                x={xCursor}
                y={yCursor}
                piece={new Piece(dragonNumero[dragon], Famille.Dragon)}
                areaData={areaData}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onAreaClick}
            ></MahjongPieceArea>
        );
        xCursor += areaData.width + areaData.espace_w;
    }
    xCursor = areaData.x_init;
    yCursor += areaData.height + areaData.espace_h;

    // fleurs and saisons
    const bonuss = [Famille.Fleurs, Famille.Saison];
    for (let bonus = 0; bonus < bonuss.length; bonus++) {
        for (let numero = 1; numero <= 4; numero++) {
            areaBuffer.push(
                <MahjongPieceArea
                    key={`${bonuss[bonus]}${numero}`}
                    x={xCursor}
                    y={yCursor}
                    piece={new Piece(numero.toString(), bonuss[bonus])}
                    areaData={areaData}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onClick={onAreaClick}
                ></MahjongPieceArea>
            );
            xCursor += areaData.width + areaData.espace_w;
        }
        xCursor = areaData.x_init;
        yCursor += areaData.height + areaData.espace_h;
    }

    return areaBuffer;
}

/**
 * adapt the area data to the image when resize
 * @param imgRef the image ref
 * @param utilitiesActu the utilities to access calculator data
 * @param combiSelected the combi selected
 * @param setTooltipInfo the function to set the tooltip info
 * @returns the new state
 */
function useRefDimension(
    imgRef: React.RefObject<HTMLImageElement>,
    utilitiesActu: UtilitiesActualType,
    combiSelected: CombiSelected | undefined,
    setTooltipInfo: React.Dispatch<React.SetStateAction<TooltypeState>>
): ImageState {
    const [areaDataState, setAreaDataState] = useState<ImageState>({
        areaData: defaultAreaData,
    });

    useEffect(() => {
        function handleResize() {
            if (imgRef.current !== null) {
                if (
                    imgRef.current.offsetWidth !==
                        areaDataState.areaData.imgWidth ||
                    imgRef.current.offsetHeight !==
                        areaDataState.areaData.imgHeight
                ) {
                    // update the area in the state
                    const newAreaData = getNewAreaData(
                        imgRef.current.offsetWidth,
                        imgRef.current.offsetHeight
                    );
                    setAreaDataState({
                        areaData: newAreaData,
                    });
                }
            }
        }
        handleResize(); // call it once to set the initial state

        window.addEventListener("resize", handleResize); // update the area when the window is resized

        return () => {
            // cleanup
            window.removeEventListener("resize", handleResize);
        };
    }, [
        areaDataState.areaData.imgHeight,
        areaDataState.areaData.imgWidth,
        combiSelected,
        imgRef,
        setTooltipInfo,
        utilitiesActu,
    ]);

    return areaDataState;
}

interface MahjongPieceAreaProps {
    utilitiesActu: UtilitiesActualType;
    combiSelected: CombiSelected | undefined;
}

/**
 * Make the mahjong image mapping to allow cliking and manage it
 * @returns
 */
export function MahjongPiecesImage({
    utilitiesActu,
    combiSelected,
}: MahjongPieceAreaProps) {
    const [tooltipInfos, setTooltipInfo] = useState<TooltypeState>();
    const ref = useRef<HTMLImageElement>(null); // ref to the img (width and height)
    const areaDataState = useRefDimension(
        ref,
        utilitiesActu,
        combiSelected,
        setTooltipInfo
    );

    let tooltip: JSX.Element = <></>;
    if (tooltipInfos !== undefined) {
        tooltip = (
            <Tooltip
                x={tooltipInfos.x}
                y={tooltipInfos.y}
                piece={tooltipInfos.piece}
                utilitiesActu={utilitiesActu}
                areaData={areaDataState.areaData}
            ></Tooltip>
        );
    }

    const areas = generationArea(
        areaDataState.areaData,
        utilitiesActu,
        combiSelected,
        setTooltipInfo
    );

    return (
        <>
            <map id="map_pieces_majong" name="map_pieces_majong">
                {areas}
            </map>

            <img
                id="img_mahjong_piece_map"
                width="700px"
                height="613px"
                useMap="#map_pieces_majong"
                alt="pieces de mahjong"
                src="/images/pieces_mahjong.jpg"
                ref={ref}
            ></img>
            {tooltip}
        </>
    );
}
