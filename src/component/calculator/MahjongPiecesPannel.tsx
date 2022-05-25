import { Card } from "antd";
import { useState } from "react";
import { Piece } from "../../model/pieces/Piece";
import { Famille } from "../../model/pieces/types";

// start coord
const x_init : number = 128;
const y_init : number = 60;
const width : number = 58;
const height : number = 74;
const espace_w : number = 1;
const espace_h : number = 6; 

type TooltypeState = {
    x : number,
    y : number,
    piece : Piece
} | undefined;


function Tooltip (x : number, y : number, piece : Piece){
    const tooltipWidth = 250;
    let leftOffset = 0;
	//on test si elle n'est pas sortie de l'ecran :
	const largeur_fenetre = window.innerWidth;
    if(tooltipWidth + width + x > largeur_fenetre){
	    leftOffset = x - tooltipWidth - 20;
	}else{
        leftOffset = x + width + 20;
	}
               
    return	(
        <Card id="tooltip" size="small" title={piece.getFrDisplayName()} className="bg-green-100" style={{ top: y + 10, left : leftOffset }}>
            <span>test</span>
        </Card>
    );
}


function MahjongPieceArea(x : number, y : number, piece : Piece, setSelection : React.Dispatch<React.SetStateAction<TooltypeState>>) : JSX.Element {
    const coord = x + "," + y + "," + (x + width) + "," + (y + height);

    return (
        <area 
            key={"area_" + piece.getFrDisplayName()}
            shape="rect" 
            coords={coord} 
            alt={piece.getFrDisplayName()} 
            title={piece.getFrDisplayName()} 
            onMouseEnter={() => {setSelection({x : x, y : y, piece : piece})}}
            onMouseLeave={() => {setSelection(undefined)}}
            >

            </area>
    );
}

export function MahjongPiecesPannel() {
    const [tooltipInfos, setTooltipInfo] = useState<TooltypeState>();

    let x = x_init;
    let y = y_init;

    // generation of the map to manage the clique and the hover
    let areaBuffer  : Array<JSX.Element> = [];

    //3 bases famille
    const baseFamilles = [Famille.Caractere, Famille.Cercle, Famille.Bambou];
    for (let baseFamille = 0; baseFamille < baseFamilles.length; baseFamille ++) {
        for (let numero = 1; numero <= 9; numero ++) {
            areaBuffer.push(MahjongPieceArea(x, y, new Piece(numero.toString(), baseFamilles[baseFamille]), setTooltipInfo));
            x += width + espace_w;
        }
        x = x_init;
        y += height + espace_h;
    }
    // vent
    const ventNumeros = ["E", "S", "O", "N"];
    for (let vent = 0; vent < ventNumeros.length; vent ++) {
        areaBuffer.push(MahjongPieceArea(x, y, new Piece(ventNumeros[vent], Famille.Vent), setTooltipInfo));
        x += width + espace_w;
    }
    x = x_init;
    y += height + espace_h;
    // dragon
    const dragonNumero = ["R", "V", "B"];
    for (let dragon = 0; dragon < dragonNumero.length; dragon ++) {
        areaBuffer.push(MahjongPieceArea(x, y, new Piece(dragonNumero[dragon], Famille.Dragon), setTooltipInfo));
        x += width + espace_w;
    }
    x = x_init;
    y += height + espace_h;

    // fleurs and saisons
    const bonuss = [Famille.Fleurs, Famille.Saison];
    for(let bonus = 0 ; bonus < bonuss.length; bonus++){
        for(let numero = 1 ; numero <= 4 ; numero ++){
            areaBuffer.push(MahjongPieceArea(x, y, new Piece(numero.toString(), bonuss[bonus]), setTooltipInfo));
            x += width + espace_w;
        }
        x = x_init;
        y += height + espace_h;
    }


    let tooltip : JSX.Element = <></>;
    if(tooltipInfos !== undefined){
        
        tooltip = Tooltip(tooltipInfos.x, tooltipInfos.y, tooltipInfos.piece);
    }

    return (
        <>
            <map id="map_pieces_majong" name="map_pieces_majong">
                {areaBuffer}
            </map>
            
            <img id="img_mahjong_piece_map" width="700px" height="613px" useMap="#map_pieces_majong" alt="pieces de mahjong" src="/images/pieces_mahjong.jpg"></img>
            {tooltip}
        </>
        
    )

}