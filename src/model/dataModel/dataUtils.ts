/////////////////////////////////////////////////////
// famille

export enum Famille{
    Caractere = "C",
    Cercle = "R", // for rond
    Bambou = "B",

    Vent = "V",
    Dragon = "D",

    Fleurs = "F",
    Saison = "S"
}

export enum NumeroVent {
    Est = "E",
    Ouest = "O",
    Nord = "N",
    Sud = "S"
}

/**
 * check if memebers of a famille can be compared with his numero to form a suite
 * @param famille the famille to test
 * @returns 
 */
export function isSuiteFamille(famille : Famille) : boolean {
    return famille === Famille.Caractere || famille === Famille.Cercle || famille === Famille.Bambou;
}

/**
 * test if a famille is a bonus one
 * @param famille the famille to test
 * @returns if the famille is a bonus one
 */
export function isHonneurFamille(famille : Famille) : boolean {
    return famille === Famille.Saison || famille === Famille.Fleurs;
}

/**
 * check if the famille is a real famille
 * @param famille the famille to check 
 * @returns 
 */
export function checkFamille(famille : string) : boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (Object as any).values(Famille).includes(famille);
}

/**
 * convert a honneur number to a vent number
 * @param numero the honneur number to convert
 * @returns the corresponding vent number
 */
export function convertHonneurNumberToVentNumber(numero : string) : NumeroVent {
    const corresp : Array<NumeroVent> = [NumeroVent.Est, NumeroVent.Sud, NumeroVent.Ouest, NumeroVent.Nord];
    return corresp[Number(numero) - 1];
}

/**
 * check if numero can be applied to famille
 * @param numero 
 * @param famille 
 * @returns 
 */
export function checkCoherence(numero : string, famille : Famille) : boolean{
    // 3 basics famille
    if(famille === Famille.Bambou || famille === Famille.Caractere || famille === Famille.Cercle){
        if(!isNaN(Number(numero))){
            const numeroConv  = Number(numero);
            return numeroConv >= 1 && numeroConv <= 9;
        } else{
            return false;
        }
         
    }
    // vent 
    else if(famille === Famille.Vent){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (Object as any).values(NumeroVent).includes(numero);
    }
    // dragon
    else if(famille === Famille.Dragon){
        return numero === "R" || numero === "V" || numero === "B";
    }
    // saison and fleurs
    else if(famille === Famille.Fleurs || famille === Famille.Saison){
        if(!isNaN(Number(numero))){
            const numeroConv  = Number(numero);
            return numeroConv >= 1 && numeroConv <= 4;
        } else{
            return false;
        }
    }


    return false;
}
////////////////////////////////////////////////////////////////////
// combinaison

export enum BaseCombi {
    Paire = "Paire",
    Suite = "suite",
    Brelan = "Brelan",
    Carre = "Carre",
    Honneur = "honneur"
}

export enum ModificateurCombi {
    ExtremNumero = "ExtremNumero", // 1 ou 9
    VentOuDragon = "VentOuDragon",
    Dominant = "Dominant",
    Joueur = "Joueur",
    HonneurCarre = "HonneurCarre",
}

export type CombiCalculated = {
    base : BaseCombi,
    modificateur : Set<ModificateurCombi>
    famille : Famille
}

/////////////////////////////////////////////////////////////////////////////////////
// mahjong rules

export enum MahjongScoring {
    normal = 1,
    OnlyBrelan = 2,
    Trouble = 3,
    OnlySuite = 4,
    CouleurPur = 5,
    OnlyDragonAndVent = 6,
    OnlyExtremNumero = 7,
    OnlyPaire = 8,
}

