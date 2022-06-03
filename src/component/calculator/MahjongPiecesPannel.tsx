import { Card } from "antd";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Piece } from "../../model/dataModel/Piece";
import { Famille } from "../../model/dataModel/dataUtils";
import { MyLogger } from "../../model/utils/logger";

//////////////////////////////////////////////
// info to build area

type AreaData = {
    imgWidth : number;
    imgHeight : number;
    x_init : number;
    y_init : number;
    width : number;
    height : number;
    espace_w : number;
    espace_h : number;
}

const defaultAreaData : AreaData = {
    imgWidth : 700,
    imgHeight : 613,
    x_init : 128,
    y_init : 60,
    width : 58,
    height : 74,
    espace_w : 1,
    espace_h : 6
};

/**
 * get the new area data with new height and width
 * @param imgWidth the actuel width of the image
 * @param imgHeight the actuel height of the image
 * @returns the new area data
 */
function getNewAreaData(imgWidth : number, imgHeight : number) : AreaData {
    const newAreaData : AreaData = {
        imgWidth : imgWidth,
        imgHeight : imgHeight,
        x_init : Math.ceil(defaultAreaData.x_init * imgWidth / defaultAreaData.imgWidth),
        y_init : Math.ceil(defaultAreaData.y_init * imgHeight / defaultAreaData.imgHeight),
        width : Math.ceil(defaultAreaData.width * imgWidth / defaultAreaData.imgWidth),
        height : Math.ceil(defaultAreaData.height * imgHeight / defaultAreaData.imgHeight),
        espace_w : Math.ceil(defaultAreaData.espace_w * imgWidth / defaultAreaData.imgWidth),
        espace_h : Math.ceil(defaultAreaData.espace_h * imgHeight / defaultAreaData.imgHeight)
    };
    return newAreaData;
}

/////////////////////////////////////////////////////////::
// state


type TooltypeState =
    | {
          x: number;
          y: number;
          piece: Piece;
      }
    | undefined;

type ImageState = {
    areaData : AreaData;
    areas : JSX.Element[];
}

////////////////////////////////////////

function Tooltip(x: number, y: number, piece: Piece, areaData : AreaData) {
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

function MahjongPieceArea(
    x: number,
    y: number,
    piece: Piece,
    areaData : AreaData,
    setSelection: React.Dispatch<React.SetStateAction<TooltypeState>>
): JSX.Element {
    const coord = x + "," + y + "," + (x + areaData.width) + "," + (y + areaData.height);

    return (
        <area
            key={"area_" + piece.getFrDisplayName()}
            shape="rect"
            coords={coord}
            alt={piece.getFrDisplayName()}
            title={piece.getFrDisplayName()}
            onMouseEnter={() => {
                setSelection({ x: x, y: y, piece: piece });
            }}
            onMouseLeave={() => {
                setSelection(undefined);
            }}
        ></area>
    );
}

/**
 * generation of the area for the pieces
 * @param imgWidth the actuel width of the image
 * @param imgHeight the actuel height of the image
 * @param setTooltipInfo the function to set the tooltip info
 * @returns the area for the pieces
 */
function generationArea(
    areaData : AreaData,
    setTooltipInfo: React.Dispatch<React.SetStateAction<TooltypeState>>
): JSX.Element[] {
    let x = areaData.x_init;
    let y = areaData.y_init;

    // generation of the map to manage the clique and the hover
    const areaBuffer: Array<JSX.Element> = [];

    //3 bases famille
    const baseFamilles = [Famille.Caractere, Famille.Cercle, Famille.Bambou];
    for (
        let baseFamille = 0;
        baseFamille < baseFamilles.length;
        baseFamille++
    ) {
        for (let numero = 1; numero <= 9; numero++) {
            areaBuffer.push(
                MahjongPieceArea(
                    x,
                    y,
                    new Piece(numero.toString(), baseFamilles[baseFamille]),
                    areaData,
                    setTooltipInfo
                )
            );
            x += areaData.width + areaData.espace_w;
        }
        x = areaData.x_init;
        y += areaData.height + areaData.espace_h;
    }
    // vent
    const ventNumeros = ["E", "S", "O", "N"];
    for (let vent = 0; vent < ventNumeros.length; vent++) {
        areaBuffer.push(
            MahjongPieceArea(
                x,
                y,
                new Piece(ventNumeros[vent], Famille.Vent),
                areaData,
                setTooltipInfo
            )
        );
        x += areaData.width + areaData.espace_w;
    }
    x = areaData.x_init;
    y += areaData.height + areaData.espace_h;
    const dragonNumero = ["R", "V", "B"];
    for (let dragon = 0; dragon < dragonNumero.length; dragon++) {
        areaBuffer.push(
            MahjongPieceArea(
                x,
                y,
                new Piece(dragonNumero[dragon], Famille.Dragon),
                areaData,
                setTooltipInfo
            )
        );
        x += areaData.width + areaData.espace_w;
    }
    x = areaData.x_init;
    y += areaData.height + areaData.espace_h;

    // fleurs and saisons
    const bonuss = [Famille.Fleurs, Famille.Saison];
    for (let bonus = 0; bonus < bonuss.length; bonus++) {
        for (let numero = 1; numero <= 4; numero++) {
            areaBuffer.push(
                MahjongPieceArea(
                    x,
                    y,
                    new Piece(numero.toString(), bonuss[bonus]),
                    areaData,
                    setTooltipInfo
                )
            );
            x += areaData.width + areaData.espace_w;
        }
        x = areaData.x_init;
        y += areaData.height + areaData.espace_h;
    }

    return areaBuffer;
}

function useRefDimension(
    imgRef: React.RefObject<HTMLImageElement>, 
    setTooltipInfo : React.Dispatch<React.SetStateAction<TooltypeState>>
) : ImageState{
    const [areaDataState, setAreaDataState] = useState<ImageState>({areaData : defaultAreaData, areas : []});

    useEffect(() => {
        if(imgRef.current !== null){
            if(imgRef.current.offsetWidth !== areaDataState.areaData.imgWidth || 
                imgRef.current.offsetHeight !== areaDataState.areaData.imgHeight){
                // update the area in the state
                const newAreaData = getNewAreaData(imgRef.current.offsetWidth, imgRef.current.offsetHeight);
                MyLogger.debug("newAreaData : " , newAreaData);
                setAreaDataState({areaData : newAreaData, areas : generationArea(newAreaData, setTooltipInfo)});
            }
        }
    }, [areaDataState.areaData.imgHeight, areaDataState.areaData.imgWidth, imgRef, setTooltipInfo]);

    return areaDataState;
}


/**
 * Make the mahjong image mapping to allow cliking and manage it
 * @returns
 */
export function MahjongPiecesPannel() {
    const [tooltipInfos, setTooltipInfo] = useState<TooltypeState>();
    const ref = useRef<HTMLImageElement>(null); // ref to the img (width and height)
    const areaDataState = useRefDimension(ref, setTooltipInfo);

    let tooltip: JSX.Element = <></>;
    if (tooltipInfos !== undefined) {
        tooltip = Tooltip(tooltipInfos.x, tooltipInfos.y, tooltipInfos.piece, areaDataState.areaData);
    }
    
    return (
        <>
            <map id="map_pieces_majong" name="map_pieces_majong">
                {areaDataState.areas}
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
