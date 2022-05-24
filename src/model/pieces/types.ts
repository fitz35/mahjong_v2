

export enum Famille{
    Caractere = "C",
    Cercle = "R", // for rond
    Bambou = "B",
    Vent = "V",
    Dragon = "D",
    Fleurs = "F",
    Saison = "S"
}

export function checkFamille(numero : string) : boolean {
    return (Object as any).values(Famille).includes(numero);
}

export function checkCoherence(numero : string, famille : Famille) : boolean{
    // 3 basics famille
    if(famille === Famille.Bambou || famille === Famille.Caractere || famille === Famille.Cercle){
        if(!isNaN(Number(numero))){
            const numeroConv : number = Number(numero);
            return numeroConv >= 1 && numeroConv <= 9;
          } else{
              return false;
          }
         
    }
    // vent 
    else if(famille === Famille.Vent){
        return numero === "E" || numero === "S" || numero === "O" || numero === "N"
    }
    // dragon
    else if(famille === Famille.Dragon){
        return numero === "R" || numero === "V" || numero === "B";
    }
    // saison and fleurs
    else if(famille === Famille.Fleurs || famille === Famille.Saison){
        if(!isNaN(Number(numero))){
            const numeroConv : number = Number(numero);
            return numeroConv >= 1 && numeroConv <= 4;
        } else{
            return false;
        }
    }


    return false;
}