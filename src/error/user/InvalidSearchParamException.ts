import { UserException } from "./UserException";

export class InvalidSearchParamException extends UserException {
    constructor() {
        super("Une erreur avec les paramètres de recherche", 
            "La partie n'a pas pu être chargée, donc les paramètres par défault ont été appliqués.");
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}