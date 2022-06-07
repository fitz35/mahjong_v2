import { Expose, Transform } from "class-transformer";
import { checkCoherence, checkFamille, Famille } from "./dataUtils";

export class Piece {
    readonly numero : string;
    @Expose()
    @Transform(({ value }) => {
        return value as Famille;
    })
    readonly famille : Famille;
    /**
     * build a piece and check his coherence with only his code, or his numero + his family
     * @param numero code or numero
     * @param famille the famille (not needed)
     */
    constructor(numero : string, famille? : Famille){
        let computedFamille : Famille;
        let computedNumero : string;
        if(famille){
            computedNumero = numero;
            computedFamille = famille;
        }else{
            if(numero.length === 2){
                computedNumero = numero.charAt(0);
                if(checkFamille(numero.charAt(1))){
                    computedFamille = numero.charAt(1) as Famille;
                }else{
                    throw new Error("Famille " + numero + " doesn't exist.");
                }
            }else{
                throw new Error("Piece cannot be instancied with wrong code " + numero);
            }
        }


        if(checkCoherence(computedNumero, computedFamille)){
            this.famille = computedFamille;
            this.numero = computedNumero;
        }else{
            throw new Error("Piece cannot be instancied with wrong numero " + numero + " for the family " + famille);
        }
    }

    /**
     * 
     * @returns get 2 digit code of this piece
     */
    public getCode = () : string => {
        return this.numero + this.famille;
    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // display

    public getFamilleDisplay = () : string => {
        const convertFamilleToFr = new Map<Famille, string>([
            [Famille.Caractere, "Charactère"],
            [Famille.Bambou, "Bambou"],
            [Famille.Cercle, "Cercle"],
            [Famille.Dragon, "Dragon"],
            [Famille.Vent, "Vent"],
            [Famille.Fleurs, "Fleur"],
            [Famille.Saison, "Saison"]
        ]);

        const famille = convertFamilleToFr.get(this.famille);
        if(famille !== undefined){
            return famille;
        }else{
            throw new Error("Famille " + this.famille + " doesn't exist.");
        }
    };

    public getNumeroDisplay = () : string => {
        if(this.famille === Famille.Bambou || 
            this.famille === Famille.Caractere || 
            this.famille === Famille.Cercle || 
            this.famille === Famille.Fleurs || 
            this.famille === Famille.Saison){
            return this.numero + " de";
        }
        else if(this.famille === Famille.Vent){
            let numeroDisplay = "";
            let voyelle = false;
            switch(this.numero){
            case "O" :
                numeroDisplay = "Ouest";
                voyelle = true;
                break;
            case "E":
                numeroDisplay = "Est";
                voyelle = true;
                break; 
            case "S" :
                numeroDisplay = "Sud";
                break;
            case "N":
                numeroDisplay = "Nord";
                break; 
            default:
                numeroDisplay = "inconnu";
            }
            return (voyelle ? "de l'" : "du ") + numeroDisplay;
        }

        else if(this.famille === Famille.Dragon){
            let numeroDisplay = "";
            switch(this.numero){
            case "R" :
                numeroDisplay = "Rouge";
                break;
            case "V":
                numeroDisplay = "Vert";
                break; 
            case "B" :
                numeroDisplay = "Blanc";
                break;
            default:
                numeroDisplay = "inconnu";
            }
            return numeroDisplay;
        }

        return "inconu";
    };

    public getFrDisplayName = () : string => {
        if(this.famille === Famille.Bambou || 
            this.famille === Famille.Caractere || 
            this.famille === Famille.Cercle || 
            this.famille === Famille.Fleurs || 
            this.famille === Famille.Saison){
            return this.getNumeroDisplay() + " " + this.getFamilleDisplay();
        }
        else {
            return this.getFamilleDisplay() + " " + this.getNumeroDisplay();
        }
    };

}