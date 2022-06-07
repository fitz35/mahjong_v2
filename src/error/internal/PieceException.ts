import { CustomException } from "../CustomException";

/**
 * a piece exception
 */
export class PieceException extends CustomException {
    constructor(message: string) {
        super("Une erreur avec la création d'une pièce", message);
        this.name = this.constructor.name;
        //Error.captureStackTrace(this, this.constructor);
    }
}