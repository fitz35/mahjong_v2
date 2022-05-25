import { Combinaison } from "./pieces/Combinaison";
import { Piece } from "./pieces/Piece"

export type SearchParamsMain = Combinaison;
export type SearchParamsJoueur = {
    main? : SearchParamsMain
    vent? : Piece
    points : number[] // cumulated
    isFirst? : boolean 
}

export type SearchParamsCalculator = {
    
    joueur1 : SearchParamsJoueur
    joueur2? : SearchParamsJoueur
    joueur3? : SearchParamsJoueur
    joueur4? : SearchParamsJoueur
    
}