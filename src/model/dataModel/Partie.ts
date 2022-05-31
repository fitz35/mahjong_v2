import { Joueur } from "./Joueur";
import { NumeroVent } from "./dataUtils";



export class Partie {
    constructor(public readonly dominant : NumeroVent, public readonly joueur1 : Joueur, public readonly joueur2? : Joueur, public readonly joueur3? : Joueur, public readonly joueur4? : Joueur) {
    
    }
    

}